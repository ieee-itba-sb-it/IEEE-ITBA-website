import {AfterViewInit, Component, Inject, Input, OnInit, SimpleChanges} from '@angular/core';
import {map, Observable, tap} from 'rxjs';
import {IEEEuser} from '../../models/ieee-user/ieee-user';
import {TranslateService} from '@ngx-translate/core';
import {roles} from '../../models/roles/roles.enum';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../../../core/services/authorization/auth.service';
import {UserService} from '../../../core/services/user/user.service';
import {AppColors} from '../../../core/services/configuration/app-config.service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit{
  @Input() navbarColors: AppColors;

  user$: Observable<IEEEuser | null>;
  isJournalist$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  language: string;
  color: string;
  isLoading: boolean = true;
  languageService: TranslateService;

  NEWS_ROLES: roles[] = [roles.admin, roles.contentCreator];

  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any, public translate: TranslateService,
              private authService: AuthService, private userService: UserService, private router: Router) {
      this.language = translate.currentLang;
      // Load name
      this.isLoading = true;
      this.user$ = this.authService.getCurrentUser().pipe(tap(() => { this.isLoading = false; }, tap(console.log)));
      this.isJournalist$ = this.user$.pipe(map((user) => {
          if (user === null) return false;
          const validRole : roles[] = user.roles.filter((role) => this.NEWS_ROLES.includes(role))
          return user.roles.length > 0;
      }));
      this.isAdmin$ = this.user$.pipe(map((user) => (user !== null && user.roles.includes(roles.admin))));
  }

  // ----------Methods----------

  // Translator
  useLanguage(language: string) {
      this.translate.use(language);
      this.language = language;
  }

  // Set Up
  ngOnInit() {
      this.pageScrollService.scroll({
          document: this.document,
          scrollTarget: '#home',
      });
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.navbarColors) {
          this.applyStyles();
      }
  }

  // Scroll
  ngAfterViewInit() {
      this.pageScrollService.scroll({
          document: this.document,
          scrollTarget: '#home',
      });
  }

  hasEnglishLanguage() {
      return this.language === 'en';
  }

  hasSpanishLanguage() {
      return this.language === 'es';
  }

  // Scroll
  scrollTo(target: string) {
      this.pageScrollService.scroll({
          document: this.document,
          scrollTarget: target,
      });
  }

  logoutUser() {
      this.authService.logout();
      this.router.navigate(['login']);
  }

  private applyStyles() {
      document.documentElement.style.setProperty('--navbar-bg-color', this.navbarColors.background);
      document.documentElement.style.setProperty('--navbar-underlying-color', this.navbarColors.underlying);
      document.documentElement.style.setProperty('--navbar-hover-color', this.navbarColors.hover);
  }

}
