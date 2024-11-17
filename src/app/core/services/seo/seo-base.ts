import {Meta, Title} from "@angular/platform-browser";
import {Router} from "@angular/router";

export abstract class SeoServiceBase {

    constructor(
        private titleService: Title,
        private metaService: Meta,
        private router: Router
    ) {  }

    protected setMetaTags(title: string, description: string, keywords: string[], imageUrl: string): void {
        this.titleService.setTitle(title);
        this.metaService.updateTag({name: 'description', content: description});
        this.metaService.updateTag({name: 'keywords', content: keywords.join(', ')});
        this.metaService.updateTag({property: 'og:title', content: title});
        this.metaService.updateTag({property: 'og:description', content: description});
        this.metaService.updateTag({property: 'og:type', content: 'website'});
        this.metaService.updateTag({property: 'og:url', content: this.router.url});
        this.metaService.updateTag({property: 'og:image', content: imageUrl});
        this.metaService.updateTag({property: 'og:site_name', content: 'IEEE ITBA'});
    }

    abstract updateMetaTags(title: string, description: string, keywords: string[], imageUrl: string): void;
}
