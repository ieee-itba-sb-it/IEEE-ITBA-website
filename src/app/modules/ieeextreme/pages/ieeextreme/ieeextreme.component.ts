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
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC00117.jpg?alt=media&token=92744a2c-ec00-4e16-bee6-fcf242d0e853',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC00172.jpg?alt=media&token=122fa106-c8b2-4737-ba83-70732864df02',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC00189.jpg?alt=media&token=3a94f8a1-fa40-45d3-b935-49f5e429bbe8',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC00257.jpg?alt=media&token=00941145-d9cd-42d7-923a-ee058ce4c3e4',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC00331.jpg?alt=media&token=475b1a54-d68e-45fd-9774-30a001a32d8d',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC_6038.jpg?alt=media&token=273e4835-ecfe-4ab8-8646-5cc55815db46',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC_6048.jpg?alt=media&token=cd6a06a3-4695-4b5c-8c4f-1de5f1853d23',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC_6054.jpg?alt=media&token=c9afdd94-0418-4ea4-8f13-d644cc091e7e',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC_6140.jpg?alt=media&token=8d75885d-561e-4cb6-9013-d178aab7ebd5',
        'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/ieeextreme%2FDSC_6404.jpg?alt=media&token=8a582c4f-80e0-4a43-966c-ffda8341a695'
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
