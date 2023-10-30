import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {blogCollectionName} from '../../../../secrets';
import {BlogService} from '../../../../core/services/blog/blog.service';
import {Observable, Subscription} from 'rxjs';
import {NewsItem} from '../../../../shared/models/news-item/news-item';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import { MatChipEvent, MatChipListboxChange } from '@angular/material/chips';

@Component({
    selector: 'app-noticias',
    templateUrl: './noticias.component.html',
    styleUrls: ['./noticias.component.css']
})

export class NoticiasComponent implements OnInit, OnDestroy {
    newsDataObs: Observable<NewsItem[]>;
    newsCountObs: Observable<number>;        // TODO: Connect with db
    tagsObs: Observable<string[]>;

    newsData: NewsItem[] = [];
    showLoadingSpinner = true;

    pageSize = 9;
    pageCount: number;
    pagesOnPaginator: Array<number>;
    currentPage = 1;

    newsSub: Subscription;
    cursor: Date;

    selectedTags: string[] = [];

    constructor(private blogService: BlogService, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any, private route: ActivatedRoute) {
        this.blogService.setCollectionName(blogCollectionName);
        this.blogService.setDocsPageSize(this.pageSize + 1);
        this.newsCountObs = this.blogService.listedDocsSizeObs();
        this.newsDataObs = this.blogService.docsObs();
        this.tagsObs = this.blogService.getDocsTagsAsObservable();
    }

    ngOnInit(): void {
        this.newsCountObs.subscribe(listedCount => this.pageCount = Math.floor((listedCount - 1) / this.pageSize) + 1);
        this.newsSub = this.newsDataObs.subscribe((data: NewsItem[]) => {
            // cuando hay nuevas noticias se llama este codigo
            this.newsData = [];
            if (data.length > 0)
                this.showLoadingSpinner = false; // significa que las noticias ya cargaron, sacamos el icono de cargando
            if (this.currentPage > 1) {
                let cursor: string = new Date(data[0].date).toISOString();
                window.history.replaceState('', '', `noticias?page=${this.currentPage}&cursor=${cursor}&tags=${this.selectedTags}`);
            }
            else window.history.replaceState('', '', 'noticias');
            for (const i in data) {
                if (data[i].listed && this.newsData.length < this.pageSize)
                    this.newsData.push(data[i]);
            }
        });
        this.route.queryParams.subscribe((params: any) => {
            if (params.cursor) this.cursor = new Date(params.cursor);
            if (params.page) this.currentPage = params.page;
        });
        this.blogService.getFirstDocsPage(this.cursor);
        this.blogService.retrieveListedDocsSize();
    }

    ngOnDestroy(): void {
        this.newsSub.unsubscribe();
    }

    scrollHome() {
        this.pageScrollService.scroll({
            document: this.document,
            scrollTarget: 'html'
        });
    }

    hasPrevPage() {
        return this.currentPage > 1;
    }

    hasNextPage() {
        return this.currentPage < this.pageCount;
    }

    nextPage(scroll: boolean) {
        if (!this.hasNextPage()) return;
        this.blogService.getNextDocsPage();
        this.currentPage++;
        if (scroll) this.scrollHome();
    }

    prevPage(scroll: boolean) {
        if (!this.hasPrevPage()) return;
        this.blogService.getPrevDocsPage();
        this.currentPage--;
        if (scroll) this.scrollHome();
    }

    onTagSelect(event: MatChipListboxChange) {
        this.selectedTags = event.value;
        this.blogService.getFirstDocsPage(this.cursor, event.value);
    }

}
