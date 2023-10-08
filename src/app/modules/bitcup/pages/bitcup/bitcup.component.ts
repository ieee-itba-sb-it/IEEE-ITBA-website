import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';

@Component({
    selector: 'app-bitcup',
    templateUrl: './bitcup.component.html',
    styleUrls: ['./bitcup.component.css']
})
export class BitcupComponent implements OnInit {

    sponsorsServiceVar: SponsorsService;

    constructor(private sponsorsService: SponsorsService) {
        this.sponsorsServiceVar = sponsorsService;
        scroll(0, 0);
    }

    ngOnInit(): void {
    }

}
