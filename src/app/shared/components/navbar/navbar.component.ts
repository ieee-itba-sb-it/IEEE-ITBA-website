import {AfterViewInit, Component, Inject, Input, OnInit, SimpleChanges} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IEEEuser} from '../../models/ieee-user/ieee-user';
import {TranslateService} from '@ngx-translate/core';
import {roles} from '../../models/roles/roles.enum';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../../../core/services/authorization/auth.service';
import {UserService} from '../../../core/services/user/user.service';
import {NavbarColors} from '../../../core/services/configuration/app-config.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit{
  @Input() navbarColors: NavbarColors;

  user$ = new BehaviorSubject<IEEEuser | null>(null);
  isJournalist$ = new BehaviorSubject<boolean>(false);
  language: string;
  color: string;
  isLoading: boolean = true;
  languageService: TranslateService;

  newsRoles: roles[] = [roles.admin, roles.contentCreator];

  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any, public translate: TranslateService,
              private authService: AuthService, private userService: UserService) {
      this.language = translate.currentLang;
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

      // Load name
      this.isLoading = true;
      this.authService.getCurrentUser().subscribe(async (usuario: IEEEuser) => {
          if (usuario) {
              const aux: number = usuario.role || await this.userService.getCurrentUserRole(usuario.email);
              if (this.newsRoles.includes(aux)) {
                  this.isJournalist$.next(true);
              }
              this.user$.next(usuario);
          }
          this.isLoading = false;
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
      window.location.reload();
  }

  private applyStyles() {
    document.documentElement.style.setProperty('--navbar-bg-color', this.navbarColors.background);
    document.documentElement.style.setProperty('--navbar-underlying-color', this.navbarColors.underlying);
    document.documentElement.style.setProperty('--navbar-hover-color', this.navbarColors.hover);
  }

}
