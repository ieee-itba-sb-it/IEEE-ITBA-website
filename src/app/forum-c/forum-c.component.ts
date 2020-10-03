import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum-c',
  templateUrl: './forum-c.component.html',
  styleUrls: ['./forum-c.component.css']
})
export class ForumCComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    var uid: string = this.route.snapshot.paramMap.get("uid");
    var tid: string = this.route.snapshot.paramMap.get("tid");

    if (uid != null && tid != null){
      
      window.location.replace(
        `https://curso.whittileaks.com/f/${uid}/unsuscribe/${tid}`
      );

    }else if (uid != null){
      
      window.location.replace(
        `https://curso.whittileaks.com/f/${uid}`
      );

    }else{

      window.location.replace(
        `https://curso.whittileaks.com/f/`
      );

    }

  }

}
