import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum-d',
  templateUrl: './forum-d.component.html',
  styleUrls: ['./forum-d.component.css']
})
export class ForumDComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    var uid: string = this.route.snapshot.paramMap.get("uid");
    
    window.location.replace(
      `https://curso.whittileaks.com/f/${uid}/unsuscribe`
    )

  }

}
