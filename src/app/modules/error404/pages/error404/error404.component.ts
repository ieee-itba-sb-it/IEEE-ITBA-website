import { Component, OnInit } from '@angular/core';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.css']
})
export class Error404Component implements OnInit {

    constructor(
        private seoService: StaticSeoService
    ) { }

    ngOnInit(): void {
        this.seoService.updateMetaTags("ERROR404.PAGETITLE", "ERROR404.PAGEDESCRIPTION", ["404", "IEEE", "ITBA"]);
    }

}
