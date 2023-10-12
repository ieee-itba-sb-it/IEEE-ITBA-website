import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../core/services/configuration/app-config.service';

@Component({
    selector: 'app-wie',
    templateUrl: './wie.component.html',
    styleUrls: ['./wie.component.css']
})
export class WieComponent implements OnInit {

    constructor(private appConfigService: AppConfigService) { }

    ngOnInit(): void {
        this.appConfigService.setNavbarColor('#702f8a');
        this.appConfigService.setTitle('WIE.PAGETITLE');
    }

}
