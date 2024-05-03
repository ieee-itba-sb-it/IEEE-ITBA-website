import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

@Component({
    selector: 'app-floating-button',
    templateUrl: './floating-button.component.html',
    styleUrls: ['./floating-button.component.css']
})
export class FloatingButtonComponent implements OnInit {

    @Input() tooltipI18n: string;
    showTooltip = false;
    color: string;

    @Output() clickEvent = new EventEmitter<void>();

    constructor(private appConfigService: AppConfigService) {
    }

    toggleTooltip() {
        this.showTooltip = !this.showTooltip;
    }

    onClick() {
        this.clickEvent.emit();
    }

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
