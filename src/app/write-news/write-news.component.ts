import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { Router } from "@angular/router";
import { newsItem, createNewsItem } from '../data-types';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-write-news',
  templateUrl: './write-news.component.html',
  styleUrls: ['./write-news.component.css']
})
export class WriteNewsComponent implements OnInit {

  editorForm: FormGroup;


  constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit() {
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
    var reference = title.toLowerCase().replace(" ", "-");

    if (title != '') {
      this.blogService.setDoc(
        createNewsItem(
          title,
          content,
          shortIntro,
          imageUrl,
          null,//Timestamp.fromDate(new Date()), 
          author,
          null,
          reference,
          null,
          listed
        )
      ).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/anuncios/${reference}`]);
        }
      })
    } else {
      this.blogService.deleteDoc(reference).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/anuncios`]);
        }
      });
    }
  }



}
