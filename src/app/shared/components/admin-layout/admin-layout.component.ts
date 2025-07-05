import {Component, OnInit, Input} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StaticSeoService } from '../../../core/services/seo/seo-static.service';

export interface Tab {
    title: string;
    link: string;
    isActive: boolean;
    icon: string;
}

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

    url: string;

    @Input() seoPageTitle: string = '';
    @Input() seoPageDescription: string = '';
    @Input() seoKeywords: string[] = [];
    @Input() tabs: Tab[];
    @Input() pageTitle: string = '';
    @Input() asimov: boolean = false;

    constructor(private router: Router, private seoService: StaticSeoService) {}

    ngOnInit(): void {
        this.seoService.updateMetaTags('ADMIN.PAGETITLE', 'ADMIN.PAGEDESCRIPTION', ['ADMIN', 'IEEE', 'ITBA'])
        this.url = this.router.url;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd)
                this.url = event.url;
        });
    }
}
