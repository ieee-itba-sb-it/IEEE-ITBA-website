import {Component, OnInit} from '@angular/core';
import { AppConfigService } from '../../../../core/services/configuration/app-config.service';
import { StaticSeoService } from 'src/app/core/services/seo/seo-static.service';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.css']
})

export class AboutUsComponent implements OnInit {

    constructor(private seoService: StaticSeoService) {
        scroll(0, 0);
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('ABOUTUS.PAGETITLE', 'ABOUTUS.PAGEDESCRIPTION', ['ABOUT US', 'IEEE', 'ITBA']);
    }
}
