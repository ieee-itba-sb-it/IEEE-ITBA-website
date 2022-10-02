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
  newsData: newsItem[] = [];
  showLoadingSpinner = true;

  pageSize = 9;
  pageCount = 4;        // TODO: Connect with db
  currentPage = 1;

  isNextPage = false;

  constructor(private blogService: BlogService) {
    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.setDocsPageSize(this.pageSize + 1);
    this.blogService.getFirstDocsPage();
    this.newsDataObs = this.blogService.docsObs();
    this.newsDataObs.subscribe((data: newsItem[]) => {
      // cuando hay nuevas noticias se llama este codigo
      this.newsData = [];
      this.isNextPage = false;
      if (data.length > 0){
        this.showLoadingSpinner = false; // significa que las noticias ya cargaron, sacamos el icono de cargando
      }
      for (const i in data) {
        if (data[i].listed) {
          if (this.newsData.length < this.pageSize) {
            this.newsData.push(data[i]);
          }
          if (this.newsData.length === this.pageSize){
            this.isNextPage = true;
          }
        }
      }
    });
  }

  ngOnInit(): void {

  }

  hasPrevPage() {
      return this.currentPage > 1;
  }

  hasNextPage() {
      return this.isNextPage;
  }

  nextPage(){
    if (this.isNextPage) {
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
