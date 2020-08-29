import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { Router } from "@angular/router";
import { newsItem, createNewsItem } from '../data-types';
import Timestamp = firestore.Timestamp;
import { blogCollectionName } from '../secrets';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      'editor': new FormControl(null)
    })
  }

  submitNews() {

    var content = document.getElementsByClassName('ql-editor')[0].innerHTML;
    var title = (<HTMLInputElement>document.getElementById("title")).value;
    var shortIntro = (<HTMLInputElement>document.getElementById("shortIntro")).value;
    var author = (<HTMLInputElement>document.getElementById("author")).value;
    var imageUrl = (<HTMLInputElement>document.getElementById("imageUrl")).value;
    var listed = (<HTMLInputElement>document.getElementById("listed")).checked;
    var reference = title.toLowerCase().split(' ').join('-'); //replace("/ /g", "-");
    var tags = ['tecnología'];
    var imageText = (<HTMLInputElement>document.getElementById("imageText")).value;;
    var ratings = [0, 0, 0, 0, 0];
    console.log(content);

    if (title != '') {
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
      })
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
