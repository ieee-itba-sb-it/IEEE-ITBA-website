import { Component, OnInit } from '@angular/core';
import { blogCollectionName } from '../../../../secrets';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { Observable} from 'rxjs';
import { newsItem } from '../../../../shared/models/news-item/news-item';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})

export class NoticiasComponent implements OnInit {
  newsDataObs: Observable<newsItem[]>;
  newsCountObs: Observable<number>;        // TODO: Connect with db

  newsData: newsItem[] = [];
  showLoadingSpinner = true;

  pageSize = 9;
  pageCount: number;
  pagesOnPaginator: Array<number>;
  currentPage = 1;

  constructor(private blogService: BlogService) {
    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.setDocsPageSize(this.pageSize + 1);
    this.newsCountObs = this.blogService.listedDocsSizeObs();
    this.newsDataObs = this.blogService.docsObs();
    this.newsCountObs.subscribe(listedCount => {
      this.pageCount = Math.floor((listedCount - 1) / this.pageSize) + 1;
    });
    this.newsDataObs.subscribe((data: newsItem[]) => {
      // cuando hay nuevas noticias se llama este codigo
      this.newsData = [];
      if (data.length > 0){
        this.showLoadingSpinner = false; // significa que las noticias ya cargaron, sacamos el icono de cargando
      }
      for (const i in data) {
        if (data[i].listed) {
          if (this.newsData.length < this.pageSize) {
            this.newsData.push(data[i]);
          }
        }
      }
    });
    this.blogService.getFirstDocsPage();
    this.blogService.retrieveListedDocsSize();
  }

  ngOnInit(): void {

  }

  hasPrevPage() {
      return this.currentPage > 1;
  }

  hasNextPage() {
      return this.currentPage < this.pageCount;
  }

  nextPage(){
    if (this.hasNextPage()) {
      this.blogService.getNextDocsPage();
      this.currentPage++;
    }
  }

  prevPage(){
    if (this.hasPrevPage()) {
      this.blogService.getPrevDocsPage();
      this.currentPage--;
    }
  }

}
