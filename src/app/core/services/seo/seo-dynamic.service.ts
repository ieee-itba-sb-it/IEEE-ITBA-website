import { Injectable } from '@angular/core';
import {SeoServiceBase} from "./seo-base";

@Injectable({
    providedIn: 'root'
})
export class DynamicSeoService extends SeoServiceBase {

    updateMetaTags(title: string, description: string, keywords: string[], imageUrl: string) {
        this.setMetaTags(title, description, keywords, imageUrl);
    }
}
