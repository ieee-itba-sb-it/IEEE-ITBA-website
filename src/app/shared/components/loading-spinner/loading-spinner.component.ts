import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent  {

    constructor(private appConfigService: AppConfigService) { }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }
}
