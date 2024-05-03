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
        this.appConfigService.setPaletteColors({
            background: '#702f8a',
            underlying: '#92519CFF',
            hover: '#AD7CB5FF'
        });
        this.appConfigService.setTitle('WIE.PAGETITLE');
    }

}
