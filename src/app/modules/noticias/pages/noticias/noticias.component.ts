import {Component, Inject, OnInit} from '@angular/core';
import { blogCollectionName } from '../../../../secrets';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { Observable} from 'rxjs';
import { NewsItem } from '../../../../shared/models/news-item/news-item';
import {PageScrollService} from "ngx-page-scroll-core";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})

export class NoticiasComponent implements OnInit {
  newsDataObs: Observable<NewsItem[]>;
  newsCountObs: Observable<number>;        // TODO: Connect with db

  newsData: NewsItem[] = [];
  showLoadingSpinner = true;

  pageSize = 9;
  pageCount: number;
  pagesOnPaginator: Array<number>;
  currentPage = 1;

  constructor(private blogService: BlogService, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.setDocsPageSize(this.pageSize + 1);
    this.newsCountObs = this.blogService.listedDocsSizeObs();
    this.newsDataObs = this.blogService.docsObs();
    this.newsCountObs.subscribe(listedCount => this.pageCount = Math.floor((listedCount - 1) / this.pageSize) + 1);
    this.newsDataObs.subscribe((data: NewsItem[]) => {
      // cuando hay nuevas noticias se llama este codigo
      this.newsData = [];
      if (data.length > 0) 
        this.showLoadingSpinner = false; // significa que las noticias ya cargaron, sacamos el icono de cargando
      for (const i in data) {
        if (data[i].listed && this.newsData.length < this.pageSize) 
          this.newsData.push(data[i]);
      }
    });
    this.blogService.getFirstDocsPage();
    this.blogService.retrieveListedDocsSize();
  }

  ngOnInit(): void {}

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

}
