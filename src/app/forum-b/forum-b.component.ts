import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum-b',
  templateUrl: './forum-b.component.html',
  styleUrls: ['./forum-b.component.css']
})
export class ForumBComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
      var forum_title: string = this.route.snapshot.paramMap.get("forum_title");

      if (forum_title != null){

        window.location.replace(
          `https://curso.whittileaks.com/f/${forum_title}/c`
        );
        
      }

  }

}
