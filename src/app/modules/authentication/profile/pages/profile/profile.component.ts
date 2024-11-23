import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import {StaticSeoService} from "../../../../../core/services/seo/seo-static.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  url: string

  tabs = [
    {
      title: "PROFILE.TABS.GENERAL",
      link: "general",
      isActive: true,
      icon: "user",
    },
    {
      title: "PROFILE.TABS.SECURITY",
      link: "security",
      isActive: true,
      icon: "lock",
    }
  ]

  user$: Observable<IEEEuser>;

  constructor(private router: Router, private authService: AuthService, private seoService: StaticSeoService) {
    this.user$ = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.seoService.updateMetaTags('PROFILE.PAGETITLE', 'PROFILE.PAGEDESCRIPTION', ['PROFILE', 'IEEE', 'ITBA'])
    this.url = this.router.url;
    this.router.events.subscribe((val) => {
      this.url = this.router.url;
    });
  }

}
