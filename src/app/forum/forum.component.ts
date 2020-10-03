import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.replace("https://curso.whittileaks.com");
  }

}
