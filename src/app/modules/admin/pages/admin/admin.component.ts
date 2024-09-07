import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
    },
    {
      title: "ADMIN.COMMISSIONSTAB.TITLE",
      link: "commissions",
      isActive: true,
      icon: "user-group",
    }
  ]

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.url = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        this.url = event.url;
    });
  }

}
