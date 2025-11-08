import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';
import {blogCollectionName} from '../../../../secrets';
import {NewsComment, NewsItem} from '../../../../shared/models/news-item/news-item';
import {BlogService} from '../../../../core/services/blog/blog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {combineLatest, combineLatestWith, forkJoin, map, merge, Observable, switchMap, tap, zip} from 'rxjs';
import {AuthService} from '../../../../core/services/authorization/auth.service';
import {IEEEuser} from '../../../../shared/models/ieee-user/ieee-user';
import {roles} from '../../../../shared/models/roles/roles.enum';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import {AuthActionModalComponent} from '../../../../shared/components/auth-action-modal/auth-action-modal.component';
import {DynamicSeoService} from "../../../../core/services/seo/seo-dynamic.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {addDoc, collection, doc} from "@angular/fire/firestore";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-noticia',
    templateUrl: './noticia.component.html',
    styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {
    user$: Observable<IEEEuser | null>;
    newsData$: Observable<NewsItem>;
    userData: IEEEuser;
    isVisible: boolean = false;
    emojisVisible: boolean = true;
    cookieValue: string = '';
    cookieName: string;
    emojisList: string[] = ['thumbsdown', 'confused', 'grin', 'joy', 'heart_eyes'];
    recommendedNews$: Observable<NewsItem[]>;
    isUserAuthorOrAdmin: boolean;
    comments$: Observable<NewsComment[]>;
    comments: NewsComment[];
    modalRef: MDBModalRef | null = null;
    commentForm: FormGroup;
    loading = false;
    readonly MAX_COMMENT_LENGTH = 300;

    @Input('id') newsReference: string = '';

    showTooltip = false;
    @Output() clickEvent = new EventEmitter<void>();

    toggleTooltip() {
        this.showTooltip = !this.showTooltip;
    }

    onClick() {
        this.router.navigate([`/write-news/${this.newsReference}`])
    }
    
    getFirstParagraph(content: string): string {
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = content;

        const paragraphs = tempContainer.querySelectorAll('p');
        const LONGITUD_MINIMA_CONTENIDO = 30;

        paragraphs.forEach(p => {
            const containsImage = p.querySelector('img') !== null;
            if (containsImage) return;

            let cleanText = p.textContent.trim();
            cleanText = cleanText.replace(/\s+/g, ' ');
            if (cleanText.length < LONGITUD_MINIMA_CONTENIDO) {
                const esEpigrafe = cleanText.toLowerCase().startsWith('créditos:') || cleanText.length < 5;

                if (esEpigrafe) return;
            }

            return cleanText;
        });

        return '';
    }

    constructor(private route: ActivatedRoute,
                @Inject(DOCUMENT) private document: any, public translate: TranslateService,
                private blogService: BlogService, private cookieService: CookieService,
                private authService: AuthService, private router: Router,
                private modalService: MDBModalService, private seoService: DynamicSeoService,
                private sanitizer: DomSanitizer) {
        this.blogService.setCollectionName(blogCollectionName);

        this.blogService.retrieveListedDocsSize();

        this.newsData$ = this.route.paramMap
            .pipe(
                tap(
                    (paramMap) => {
                        this.cookieName = `${paramMap.get('id')}-vote`;
                        if (this.cookieService.check(this.cookieName)) {
                            this.toggleSelectRating();
                            this.cookieValue = this.cookieService.get(this.cookieName);
                        }
                    }
                ),
                map((param) => (param.get('id'))),
                switchMap((id) => this.blogService.getDoc(id)),
                tap((blog) => {
                    if (!blog) {
                        return;
                    }
                    const {title, tags, imageUrl, content} = blog;
                    this.seoService.updateMetaTags(title, this.getFirstParagraph(content),  tags, imageUrl);
                })
            );
        this.commentForm = new FormGroup({content: new FormControl('', [Validators.required, Validators.maxLength(300)])});
    }

    useLanguage(language: string) {
        this.translate.use(language);
    }

    ngOnInit(): void {
        combineLatest([this.authService.getCurrentUser(), this.newsData$]).subscribe(
            ([user, news]) => {
                this.userData = user;
                if (news && news.date) this.recommendedNews$ = this.blogService.getRecommendedNews(news.date);
                if (user != null && news != null)
                    this.isUserAuthorOrAdmin = (user.fullname == news.author && user.roles.includes(roles.contentCreator)) || user.roles.includes(roles.admin);
                else
                    this.isUserAuthorOrAdmin = false;
            });
        this.blogService.getNewsComments(this.newsReference).subscribe(comments => {
            this.comments = comments;
        });
        this.user$ = this.authService.getCurrentUser();
    }

    rateNews(emoji: string, rating: number) {
        if (this.userData == null) {
            this.openModal();
            return false;
        }
        this.newsData$.subscribe(news => {
            if (news != null) {
                if (!this.cookieService.check(this.cookieName)) {
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 365);
                    this.cookieService.set(this.cookieName, emoji, expirationDate);
                    this.cookieValue = emoji;
                    this.newsData$ = this.blogService.incrementRating(news, rating);
                } else {
                    this.cookieService.delete(this.cookieName);
                    this.cookieValue = '';
                    this.newsData$ = this.blogService.decrementRating(news, rating);
                }
                this.toggleSelectRating();
            }
        });
    }

    toggleSelectRating() {
        this.isVisible = !this.isVisible;
        this.emojisVisible = !this.emojisVisible;
    }

    isSelected(i: number): boolean {
        return this.cookieValue === this.emojisList[i];
    }

    openModal() {
        this.modalRef = this.modalService.show(AuthActionModalComponent, {
            class: 'modal-dialog-centered'
        });
    }

    submitComment() {
        if (this.commentForm.invalid) return;

        this.loading = true;
        const content = this.commentForm.value.content.trim();
        this.user$.subscribe(user => {
            if(!user) {        console.log(this.comments);

                this.openModal();
                return;
            }
            const newComment = {
                userId: user.uID,
                userFullname: user.fullname,
                content,
                timestamp: new Date(),
                id: null
            };

            const added = this.blogService.addComment(newComment, this.newsReference);
            if(added)
                this.comments.push(newComment);
        });
        this.loading = false;
    }

    canDelete(comment: NewsComment): boolean {
        let toReturn: boolean;
        this.user$.subscribe(user => {
            toReturn = comment.userId === user.uID || user.roles.includes(roles.contentCreator)
                || user.roles.includes(roles.admin);
        });
        return toReturn;
    }

    deleteComment(comment: NewsComment) {
        const deleted = this.blogService.deleteComment(comment.id, this.newsReference);
        if(deleted)
            this.comments.splice(this.comments.indexOf(comment), 1);
    }

    formatDate(timestamp: any): string {
        const date: Date = timestamp instanceof Date ? timestamp : timestamp.toDate();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    getSanitizedContent(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}
