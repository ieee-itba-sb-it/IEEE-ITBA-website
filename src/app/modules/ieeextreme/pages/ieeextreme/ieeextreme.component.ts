import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import {Event, IeeeEvent} from "../../../../shared/models/event/event";
import {EventService} from "../../../../core/services/event/event.service";
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";
import {StorageService} from "../../../../core/services/storage/storage.service";
import {EventFact} from "../../../../shared/components/event-facts-banner/event-facts-banner.component";

@Component({
    selector: 'app-ieeextreme',
    templateUrl: './ieeextreme.component.html',
    styleUrls: ['./ieeextreme.component.css']
})
export class IeeextremeComponent implements OnInit {

    event?: Event;

    sponsorsServiceVar: SponsorsService;

    imageLinks: string[] = [];

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

    facts: EventFact[] = [
        { value: '17', label: 'IEEEXTREME.FACTS.EDITIONS' },
        { value: '60+', label: 'IEEEXTREME.FACTS.PARTICIPANTS' },
        { value: '11', label: 'IEEEXTREME.FACTS.TOPTEAMS' },
        { value: '24hs', label: 'IEEEXTREME.FACTS.HOURS' }
    ];

    constructor(private sponsorsService: SponsorsService, private eventService: EventService, private seoService: StaticSeoService, private storageService: StorageService) {
        scroll(0, 0);
        this.sponsorsServiceVar = sponsorsService;
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('IEEEXTREME.PAGETITLE', 'IEEEXTREME.PAGEDESCRIPTION', ['IEEEXTREME', 'IEEE', 'ITBA'], 'events/ieeextreme/XtremeLogo.png');
        this.getEvent();
        this.loadGallery();
    }

    async loadGallery(): Promise<void> {
        const files = await this.storageService.list('ieeextreme/gallery');
        this.imageLinks = files.map(file => file.publicUrl);
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
