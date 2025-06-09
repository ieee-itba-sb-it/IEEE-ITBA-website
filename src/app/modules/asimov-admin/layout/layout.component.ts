import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
    constructor(private appConfigService: AppConfigService) {

    }

    ngOnInit() {
        this.appConfigService.setAppColors({
            background: '#862633',
            underlying: '#C83D59FF',
            hover: '#9E4C67FF'
        });
    }
}
