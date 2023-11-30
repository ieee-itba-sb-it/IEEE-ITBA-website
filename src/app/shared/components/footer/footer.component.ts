import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    constructor() { }

    @Input() color: string = '#00629BFF';

    ngOnInit(): void {
    }

}
