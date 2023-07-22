import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private navbarColor = new BehaviorSubject('');
  constructor(private titleService: Title, private translate: TranslateService, private router: Router) {
    router.events.subscribe(() => {
      this.resetTitle();
      this.resetNavbarColor();
    });
  }

  // title tiene que ser un codigo i18n
  setTitle(title: string) {
    this.translate.get(title).subscribe((res: string) => {
      this.titleService.setTitle(res);
    });
  }

  resetTitle() {
    this.translate.get('DEFAULT.PAGETITLE').subscribe((res: string) => {
      this.titleService.setTitle(res);
    });
  }

  // Tiene que ser de tipo RGB, RGBA o HEX en formato CSS
  setNavbarColor(navbarColor: string) {
    this.navbarColor.next(navbarColor);
  }

  resetNavbarColor() {
    this.navbarColor.next('');
  }

  getNavbarColor() {
    return this.navbarColor.asObservable();
  }
}
