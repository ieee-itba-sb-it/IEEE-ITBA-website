import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.css']
})
export class ButtonComponent {
    @Input() disabled:boolean=false;
    @Input() asimov:boolean=false;
    @Input() content:string;
    @Input() href:string;
    @Input() imageUrl:string;
    @Input() imageAlt:string;
    @Input() icon:string;
    @Input() click: Function;
}
