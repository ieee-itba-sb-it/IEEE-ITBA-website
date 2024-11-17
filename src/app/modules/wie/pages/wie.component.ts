import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../core/services/configuration/app-config.service';
import {StaticSeoService} from "../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-wie',
    templateUrl: './wie.component.html',
    styleUrls: ['./wie.component.css']
})
export class WieComponent implements OnInit {

    constructor(private appConfigService: AppConfigService, private seoService: StaticSeoService) { }

    ngOnInit(): void {
        this.seoService.updateMetaTags('WIE.PAGETITLE', 'WIE.PAGEDESCRIPTION', ['WIE', 'IEEE', 'ITBA'], "wie/wie_logo.svg");
        this.appConfigService.setAppColors({
            background: '#702f8a',
            underlying: '#92519CFF',
            hover: '#AD7CB5FF'
        });
    }

}
