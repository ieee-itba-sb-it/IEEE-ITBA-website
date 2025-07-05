import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "../../../core/services/configuration/app-config.service";
import {Tab} from "../../../shared/components/admin-layout/admin-layout.component";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
    constructor(private appConfigService: AppConfigService) {

    }

    tabs: Tab[] = [
        {
            title: "ASIMOVCUP.ADMIN.ROBOTSMANAGERTAB.TITLE",
            link: "robots",
            isActive: true,
            icon: "user",
        }, {
            title: "ASIMOVCUP.ADMIN.ENCOUNTERSTAB.TITLE",
            link: "encounters",
            isActive: true,
            icon: "user"
        }
    ]


    ngOnInit() {
        this.appConfigService.setAppColors({
            background: '#862633',
            underlying: '#C83D59FF',
            hover: '#9E4C67FF'
        });
    }
}
