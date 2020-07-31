import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsMainpageComponent } from './news-mainpage/news-mainpage.component';
import { MainArticleComponent } from './main-article/main-article.component';
import { ArticlesRowComponent } from './articles-row/articles-row.component';
import { ArticlesColumnComponent } from './articles-column/articles-column.component';

//Angular material
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { ArticleCardComponent } from './article-card/article-card.component';

//Bootstrap material
import { ButtonsModule, WavesModule, CardsModule, IconsModule  } from 'angular-bootstrap-md'

@NgModule({
  declarations: [NewsMainpageComponent, MainArticleComponent, ArticlesRowComponent, ArticlesColumnComponent, ArticleCardComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    ButtonsModule, WavesModule, CardsModule, IconsModule
  ]
})
export class NewsModule { }
