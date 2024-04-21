import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  tabs = [
    {
      title: "ADMIN.USERTAB",
      link: "users",
      isActive: true,
      icon: "user",
      selected: this.router.url.split("/")[1] == "users"
    }
  ]

  constructor(private router: Router) {}
}
