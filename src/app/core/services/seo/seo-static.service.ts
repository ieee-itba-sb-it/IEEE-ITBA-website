import { Injectable } from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {SeoServiceBase} from "./seo-base";

@Injectable({
    providedIn: 'root'
})
export class StaticSeoService extends SeoServiceBase {

    constructor(
        titleService: Title,
        metaService: Meta,
        router: Router,
        private translate: TranslateService
    ) {
        super(titleService, metaService, router);
    }

    updateMetaTags(titleI18n: string, descriptionI18n: string, keywords: string[], imagePath: string = 'general-icons/ieee-itba.png') {
        const baseUrl = window.location.origin;
        const title = this.translate.instant(titleI18n);
        const description = this.translate.instant(descriptionI18n);
        const imageUrl = `${baseUrl}/assets/image/${imagePath}`;
        this.setMetaTags(title, description, keywords, imageUrl);
    }
}
