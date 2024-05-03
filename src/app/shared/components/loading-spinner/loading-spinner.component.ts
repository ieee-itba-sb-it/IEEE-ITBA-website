import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {

    color: string;

    constructor(private appConfigService: AppConfigService) { }

    getColor() {
        this.appConfigService.getPaletteColors().subscribe(
            palletColors => {
                this.color = palletColors.background;
            }
        );
    }

    ngOnInit(): void {
        this.getColor();
    }
}
