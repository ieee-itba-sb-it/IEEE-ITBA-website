import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  url: string

  tabs = [
    {
      title: "ADMIN.USERTAB.TITLE",
      link: "users",
      isActive: true,
      icon: "user",
    }
  ]

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.url = this.router.url;
  }

}
