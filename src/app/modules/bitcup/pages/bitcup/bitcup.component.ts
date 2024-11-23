import {Component, OnInit} from '@angular/core';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';
import {Event, IeeeEvent} from "../../../../shared/models/event/event";
import {EventService} from "../../../../core/services/event/event.service";
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-bitcup',
    templateUrl: './bitcup.component.html',
    styleUrls: ['./bitcup.component.css']
})
export class BitcupComponent implements OnInit {

    sponsorsServiceVar: SponsorsService;
    event?: Event;

    constructor(private sponsorsService: SponsorsService, private eventService: EventService, private seoService: StaticSeoService) {
        this.sponsorsServiceVar = sponsorsService;
        scroll(0, 0);
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('BITCUP.PAGETITLE', 'BITCUP.PAGEDESCRIPTION', ['BITCUP', 'IEEE', 'ITBA'], 'events/bitcup/bitcup.png');
        this.getEvent();
    }

    getEvent(): void {
        this.eventService.getEvent(IeeeEvent.BITCUP)
            .subscribe(event => {
                this.event = event;
            });
    }

    updateEvent(event: Event) {
        this.event = event;
    }
}
