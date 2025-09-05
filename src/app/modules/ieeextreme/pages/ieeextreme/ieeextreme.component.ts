import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import {Event, IeeeEvent} from "../../../../shared/models/event/event";
import {EventService} from "../../../../core/services/event/event.service";
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-ieeextreme',
    templateUrl: './ieeextreme.component.html',
    styleUrls: ['./ieeextreme.component.css']
})
export class IeeextremeComponent implements OnInit {

    event?: Event;

    sponsorsServiceVar: SponsorsService;

    imageLinks: string[] = [
    //     'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FDSC_5040.webp?alt=media&token=230dcff9-01bb-4d71-8a62-e2d7241c7112',
    //     'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FDSC_5042.webp?alt=media&token=ec9e7982-a5df-417d-bb48-393085860590',
    //     'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FIMG_4429.webp?alt=media&token=e6f19f8e-c707-41d0-8dfc-702b1681346f',
    //     'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FIMG_4449.webp?alt=media&token=36dc7cbc-6be4-4a24-aafc-cd4dc2eb3447',
    //     'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FIMG_4451.webp?alt=media&token=dbdbb96e-2221-4ad1-b240-bdb6c16bc930',
    //     'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FIMG_4444.jpg?alt=media&token=42bf91ac-c23b-46ff-8647-94669d86db7a',
    //     'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FIMG_4425.jpg?alt=media&token=08d4fc1d-d8e1-401a-be85-302985f33587'
    ];

    contacts = [
        {
            name: 'Nicolás Agustín Beade',
            mail: 'nbeade@itba.edu.ar'
        },
        {
            name: 'Miranda Ormaechea Graiver',
            mail: 'mormaecheagraiver@itba.edu.ar'
        }
    ];

    facts = [ 'IEEEXTREME.FACTS.EDITIONS', 'IEEEXTREME.FACTS.PARTICIPANTS',
        'IEEEXTREME.FACTS.TOPTEAMS', 'IEEEXTREME.FACTS.HOURS' ]

    constructor(private sponsorsService: SponsorsService, private eventService: EventService, private seoService: StaticSeoService) {
        scroll(0, 0);
        this.sponsorsServiceVar = sponsorsService;
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('IEEEXTREME.PAGETITLE', 'IEEEXTREME.PAGEDESCRIPTION', ['IEEEXTREME', 'IEEE', 'ITBA'], 'events/ieeextreme/XtremeLogo.png');
        this.getEvent();
    }

    getEvent(): void {
        this.eventService.getEvent(IeeeEvent.IEEE_EXTREME)
            .subscribe(event => {
                this.event = event;
            });
    }

    updateEvent(event: Event) {
        this.event = event;
    }
}
