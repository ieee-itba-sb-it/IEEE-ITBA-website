import { Injectable } from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
      private titleService: Title,
      private metaService: Meta,
      private router: Router,
      private translate: TranslateService
    ) { }

    updateMetaTags(titleI18n: string, descriptionI18n: string, keywords: string[], imageUrl: string = 'general-icons/ieee-logo.png') {
        const baseUrl = window.location.origin;
        const title = this.translate.instant(titleI18n);
        const description = this.translate.instant(descriptionI18n);
        this.titleService.setTitle(title);
        this.metaService.updateTag({name: 'description', content: description});
        this.metaService.updateTag({name: 'keywords', content: keywords.join(', ')});
        this.metaService.updateTag({property: 'og:title', content: title});
        this.metaService.updateTag({property: 'og:description', content: description});
        this.metaService.updateTag({property: 'og:type', content: 'website'});
        this.metaService.updateTag({property: 'og:url', content: this.router.url});
        this.metaService.updateTag({property: 'og:image', content: baseUrl + '/assets/images/' + imageUrl});
        this.metaService.updateTag({property: 'og:site_name', content: 'IEEE ITBA'});
    }
}
