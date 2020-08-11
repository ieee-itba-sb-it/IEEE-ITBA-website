import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { blogCollectionName} from '../secrets';
import { Observable } from 'rxjs';
import { newsItem, createNewsItem } from '../data-types';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { Router } from "@angular/router";

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
    if (this.route.snapshot.paramMap.get('id') != null){
      this.newsData = this.blogService.getDoc(this.route.snapshot.paramMap.get('id'));

      this.newsData.subscribe((data: newsItem) => {
          if (data){
            console.log(data);

            document.getElementById("titulo").setAttribute("value",  data.title);
            document.getElementById("nombreUrl").setAttribute("value",  data.reference);
            document.getElementById("autor").setAttribute("value",  data.author);
            document.getElementById("imageUrl").setAttribute("value",  data.imageUrl);
            document.getElementById("imageText").setAttribute("value",  data.imageText);
            document.getElementById("shortIntro").setAttribute("value",  data.shortIntro);
            (<HTMLInputElement>document.getElementById("listed")).checked = data.listed;
            document.getElementById("content").innerHTML = data.content;
          }
        }
      );
    }

  }
  sendAnuncio(){
    console.log("sending...");
    var title = (<HTMLInputElement>document.getElementById("titulo")).value;
    console.log(title);

    var content = (<HTMLInputElement>document.getElementById("content")).value;
    var imageUrl = (<HTMLInputElement>document.getElementById("imageUrl")).value;
    var autor = (<HTMLInputElement>document.getElementById("autor")).value;
    var imageText = (<HTMLInputElement>document.getElementById("imageText")).value;
    var reference = (<HTMLInputElement>document.getElementById("nombreUrl")).value;
    var shortIntro = (<HTMLInputElement>document.getElementById("shortIntro")).value;
    var listed = (<HTMLInputElement>document.getElementById("listed")).checked;
    var tags= ['hola','chau'];

    console.log(reference);

    if (title != ''){
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
          listed
        )
      ).subscribe(sent => {
        if (sent){
          this.router.navigate([`/anuncios/${reference}`]);
        }
      })
    }else{
      this.blogService.deleteDoc(reference).subscribe(sent => {
        if (sent){
          this.router.navigate([`/anuncios`]);
        }
      });
    }


  }
}
