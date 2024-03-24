import { Component, Inject, OnInit } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from './core/services/configuration/app-config.service';
import { GuardsCheckEnd, GuardsCheckStart, NavigationCancel, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    loading: boolean = false;

    constructor(private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              public translate: TranslateService,
              private appConfigService: AppConfigService,
              private router: Router) {
        if (translate.getLangs().length === 0) {
            translate.addLangs(['en', 'es']);
            translate.setDefaultLang('en');
            const browserLang = translate.getBrowserLang();
            translate.use(browserLang.match(/es|en/) ? browserLang : 'en');
        }
    }

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof GuardsCheckStart) {
                this.loading = true;
            }     
            if (event instanceof GuardsCheckEnd || event instanceof NavigationCancel) {
                this.loading = false;
            } 
        });
    }

    title = 'ITBA-IEEE-Website-A9';

    getNavbarColor() {
        return this.appConfigService.getNavbarColor();
    }

    useLanguage(language: string) {
        this.translate.use(language);
    }
}
