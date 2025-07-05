import { Component, OnInit } from '@angular/core';
import {Tab} from "../../../../shared/components/admin-layout/admin-layout.component";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent {

    tabs: Tab[] = [
        {
            title: "ADMIN.USERTAB.TITLE",
            link: "users",
            isActive: true,
            icon: "user",
        },
        {
            title: "ADMIN.COMMISSIONSTAB.TITLE",
            link: "commissions",
            isActive: true,
            icon: "user-group",
        },
        {
            title: "ADMIN.TEAMREQUESTSTAB.TITLE",
            link: "team-requests",
            isActive: true,
            icon: "door-open",
        }
    ]


}
