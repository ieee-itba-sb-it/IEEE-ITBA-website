import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

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

  constructor(private router: Router, private seoService: StaticSeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags('ADMIN.PAGETITLE', 'ADMIN.PAGEDESCRIPTION', ['ADMIN', 'IEEE', 'ITBA'])
    this.url = this.router.url;
  }

}
