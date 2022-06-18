import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { blogCollectionName } from '../../../../secrets';
import { Observable } from 'rxjs';
import { newsItem } from '../../../../shared/models/news-item/news-item';
import { createNewsItem } from '../../../../shared/models/data-types';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';

import { sanitizeString } from '../../utils';

import Timestamp = firestore.Timestamp;

@Component({
  selector: 'app-editar-anuncio',
  templateUrl: './editar-anuncio.component.html',
  styleUrls: ['./editar-anuncio.component.css']
})
export class EditarAnuncioComponent implements OnInit {
  newsData: Observable<newsItem>;

  constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.setCollectionName(blogCollectionName);
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.newsData = this.blogService.getDoc(this.route.snapshot.paramMap.get('id'));

      this.newsData.subscribe((data: newsItem) => {
        if (data) {
          document.getElementById('titulo').setAttribute('value', data.title);
          document.getElementById('nombreUrl').setAttribute('value', data.reference);
          document.getElementById('autor').setAttribute('value', data.author);
          document.getElementById('imageUrl').setAttribute('value', data.imageUrl);
          document.getElementById('imageText').setAttribute('value', data.imageText);
          document.getElementById('shortIntro').setAttribute('value', data.shortIntro);
          (document.getElementById('listed') as HTMLInputElement).checked = data.listed;
          document.getElementById('content').innerHTML = data.content;
        }
      }
      );
    }

  }
  sendAnuncio() {
    const title = (document.getElementById('titulo') as HTMLInputElement).value;

    const content = (document.getElementById('content') as HTMLInputElement).value;
    const imageUrl = (document.getElementById('imageUrl') as HTMLInputElement).value;
    const autor = (document.getElementById('autor') as HTMLInputElement).value;
    const imageText = (document.getElementById('imageText') as HTMLInputElement).value;
    const reference = encodeURIComponent( sanitizeString( (document.getElementById('nombreUrl') as HTMLInputElement).value )  );
    const shortIntro = (document.getElementById('shortIntro') as HTMLInputElement).value;
    const listed = (document.getElementById('listed') as HTMLInputElement).checked;
    const tags = ['hola', 'chau'];
    const ratings = [0, 0, 0, 0, 0];

    if (title !== '') {
      this.blogService.setDoc(
        createNewsItem(
          title,
          content,
          shortIntro,
          imageUrl,
          Timestamp.fromDate(new Date()),
          autor,
          imageText,
          reference,
          tags,
          listed,
          ratings
        )
      ).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/anuncios/${reference}`]);
        }
      });
    } else {
      this.blogService.deleteDoc(reference).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/anuncios`]);
        }
      });
    }


  }
}
