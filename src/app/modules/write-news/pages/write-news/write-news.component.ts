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
import {AuthService} from '../../../../core/services/authorization/auth.service';
import {Observable} from 'rxjs';
import {IEEEuser} from '../../../../shared/models/ieee-user/ieee-user';

@Component({
  selector: 'app-write-news',
  templateUrl: './write-news.component.html',
  styleUrls: ['./write-news.component.css']
})
export class WriteNewsComponent implements OnInit {

  editorForm: FormGroup;
  user: IEEEuser;
  durationInSeconds = 5;
  newsContent: NewsItem;

  constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService, private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit() {
    this.newsContent = {
      title: '',
      shortIntro: '',
      content: '',
      imageUrl: '',
      author: '',
      reference: '',
      date: null,
      imageText: '',
      listed: true,
      tags: [],
      ratings: [],
    };
    this.blogService.setCollectionName(blogCollectionName);
    this.editorForm = new FormGroup({
      editor: new FormControl(null)
    });
    this.authService.getCurrentUser().subscribe((value: IEEEuser) => {
      this.user = value;
    });
    /*
    setTimeout(() => {
      const text = document.getElementsByClassName('ql-editor')[0].innerHTML;
      const breakCharacterIdx = text.indexOf('<br>');
      const pampadour = text.substring(0, breakCharacterIdx);
      const content = text.substring(breakCharacterIdx + 4);      // +4 to skip all characters of <br>
      console.log(pampadour);
      console.log(content);
    }, 5000);
    */
  }

  updateNewsText() {
    const text = document.getElementsByClassName('ql-editor')[0].innerHTML;
    const [shortIntro, content] = this.splitText(text);
    this.newsContent.shortIntro = shortIntro;
    this.newsContent.content = content;
  }

  splitText(text: string) {
    const breakCharacterIdx = text.indexOf('<br>');
    const shortIntro = text.substring(0, breakCharacterIdx);
    const content = text.substring(breakCharacterIdx + 4);      // +4 to skip all characters of <br>
    return [shortIntro, content];
  }

  submitNews() {
    // Values read from inputs
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const imageUrl = (document.getElementById('imageUrl') as HTMLInputElement).value;
    const imageText = (document.getElementById('imageText') as HTMLInputElement).value;

    // Parse text and split into pampadour (text before image) and content (after image)
    const text = document.getElementsByClassName('ql-editor')[0].innerHTML;
    const [shortIntro, content] = this.splitText(text);

    // Taken from current user
    const author = this.user.fname + ' ' + this.user.lname;

    const listed = (document.getElementById('listed') as HTMLInputElement).checked;
    const reference =  encodeURIComponent( sanitizeString( title ) );
    const tags = ['tecnología'];

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
          tags,
          listed,
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
