import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import { NewsItem } from '../../../../shared/models/news-item/news-item';
import { createNewsItem } from '../../../../shared/models/data-types';
import Timestamp = firestore.Timestamp;
import { blogCollectionName } from '../../../../secrets';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sanitizeString } from '../../utils';

@Component({
  selector: 'app-write-news',
  templateUrl: './write-news.component.html',
  styleUrls: ['./write-news.component.css']
})
export class WriteNewsComponent implements OnInit {

  editorForm: FormGroup;
  durationInSeconds = 5;

  constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.blogService.setCollectionName(blogCollectionName);
    this.editorForm = new FormGroup({
      editor: new FormControl(null)
    });
  }

  submitNews() {

    const content = document.getElementsByClassName('ql-editor')[0].innerHTML;
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const shortIntro = (document.getElementById('shortIntro') as HTMLInputElement).value;
    const author = (document.getElementById('author') as HTMLInputElement).value;
    const imageUrl = (document.getElementById('imageUrl') as HTMLInputElement).value;
    const listed = (document.getElementById('listed') as HTMLInputElement).checked;
    const reference =  encodeURIComponent( sanitizeString( title ) );
    const tags = ['tecnología'];
    const imageText = (document.getElementById('imageText') as HTMLInputElement).value;
    const ratings = [0, 0, 0, 0, 0];

    if (title !== '') {
      this.blogService.setDoc(
        createNewsItem(
          title,
          content,
          shortIntro,
          imageUrl,
          Timestamp.fromDate(new Date()),
          author,
          imageText,
          reference,
          listed,
          tags,
          ratings
        )
      ).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/noticias/${reference}`]);
        }
      });
    } else {
      this.blogService.deleteDoc(reference).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/noticias`]);
        }
      });
    }
  }

  openSnackBar() {
    this.snackBar.open('No se pudo subir la noticia', 'Cerrar', {
      duration: this.durationInSeconds * 1000,
    });
  }



}
