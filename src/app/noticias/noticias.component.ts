import { Component, OnInit } from '@angular/core';
import { blogCollectionName } from '../secrets';
import { BlogService } from '../blog.service';
import { pipe, Observable } from 'rxjs';
import { newsItem } from '../data-types';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})



export class NoticiasComponent implements OnInit {
  newsDataObs: Observable<newsItem[]>;
  newsData: newsItem[] = [];
  showLoadingSpinner: boolean = true;

  constructor(private blogService: BlogService) {
    this.blogService.setCollectionName(blogCollectionName);

    this.blogService.getDocs();
    this.newsDataObs = this.blogService.docsObs();
    this.newsDataObs.subscribe((data: newsItem[]) => {
      // cuando hay nuevas noticias se llama este codigo
      console.log(data);
      this.newsData = [];
      if (data.length > 0){
        this.showLoadingSpinner = false; // significa que las noticias ya cargaron, sacamos el icono de cargando
      }
      for (var i in data) {
        if (data[i].listed) {
          this.newsData.push(data[i]);
        }
      }
      this.newsData.sort((a: newsItem, b: newsItem) => (a.date.getTime() > b.date.getTime() ? -1 : 1));

    });

  }


  ngOnInit(): void {

  }

}
