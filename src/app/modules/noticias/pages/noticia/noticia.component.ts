import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';
import {blogCollectionName} from '../../../../secrets';
import {NewsItem} from '../../../../shared/models/news-item/news-item';
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

@Component({
    selector: 'app-noticia',
    templateUrl: './noticia.component.html',
    styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {
    newsData$: Observable<NewsItem>;
    userData: IEEEuser;
    isVisible: boolean = false;
    emojisVisible: boolean = true;
    cookieValue: string = '';
    cookieName: string;
    emojisList: string[] = ['thumbsdown', 'confused', 'grin', 'joy', 'heart_eyes'];
    recommendedNews$: Observable<NewsItem[]>;
    isUserAuthorOrAdmin: boolean;

    modalRef: MDBModalRef | null = null;

    @Input('id') newsReference: string = '';

    showTooltip = false;
    @Output() clickEvent = new EventEmitter<void>();

    toggleTooltip() {
        this.showTooltip = !this.showTooltip;
    }

    onClick() {
        this.router.navigate([`/write-news/${this.newsReference}`])
    }

    constructor(private route: ActivatedRoute,
                @Inject(DOCUMENT) private document: any, public translate: TranslateService,
                private blogService: BlogService, private cookieService: CookieService,
                private authService: AuthService, private router: Router,
                private modalService: MDBModalService, private seoService: DynamicSeoService) {
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
                    const {title, shortIntro, tags, imageUrl} = blog;
                    this.seoService.updateMetaTags(title, shortIntro, tags, imageUrl);
                })
            );

    }

    useLanguage(language: string) {
        this.translate.use(language);
    }

    ngOnInit(): void {
        this.newsData$.subscribe(news => {console.log(news)});
        combineLatest([this.authService.getCurrentUser(), this.newsData$]).subscribe(
            ([user, news]) => {
                console.log(news);
                this.userData = user;
                if (news && news.date) this.recommendedNews$ = this.blogService.getRecommendedNews(news.date);
                if (user != null && news != null)
                    this.isUserAuthorOrAdmin = (user.fullname == news.author && user.roles.includes(roles.contentCreator)) || user.roles.includes(roles.admin);
                else
                    this.isUserAuthorOrAdmin = false;
            })
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
}
