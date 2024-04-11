import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-floating-button',
    templateUrl: './floating-button.component.html',
    styleUrls: ['./floating-button.component.css']
})
export class FloatingButtonComponent {

    @Input() tooltipI18n: string;
    showTooltip = false;

    @Output() clickEvent = new EventEmitter<void>();

    toggleTooltip() {
        this.showTooltip = !this.showTooltip;
    }

    onClick() {
        this.clickEvent.emit();
    }
}
