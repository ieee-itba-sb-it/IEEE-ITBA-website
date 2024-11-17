import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-sponsors',
    templateUrl: './sponsors.component.html',
    styleUrls: ['./sponsors.component.css'],
})
export class SponsorsComponent implements OnInit {

    sponsorsServiceVar: SponsorsService;

    constructor(private sponsorsService: SponsorsService, private seoService: StaticSeoService) {
        this.sponsorsServiceVar = sponsorsService;
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('SPONSORS.PAGETITLE', 'SPONSORS.PAGEDESCRIPTION', ['SPONSORS', 'IEEE', 'ITBA']);
    }

}
