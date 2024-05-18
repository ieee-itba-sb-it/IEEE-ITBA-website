import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

@Component({
    selector: 'app-floating-button',
    templateUrl: './floating-button.component.html',
    styleUrls: ['./floating-button.component.css']
})
export class FloatingButtonComponent {

    @Input() tooltipI18n: string;
    showTooltip = false;

    @Output() clickEvent = new EventEmitter<void>();

    constructor(private appConfigService: AppConfigService) {
    }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }

    toggleTooltip() {
        this.showTooltip = !this.showTooltip;
    }

    onClick() {
        this.clickEvent.emit();
    }
}
