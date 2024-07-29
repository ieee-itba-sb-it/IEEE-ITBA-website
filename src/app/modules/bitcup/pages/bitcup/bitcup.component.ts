import {Component, OnInit} from '@angular/core';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';
import {Event, IeeeEvent} from "../../../../shared/models/event/event";
import {EventService} from "../../../../core/services/event/event.service";

@Component({
    selector: 'app-bitcup',
    templateUrl: './bitcup.component.html',
    styleUrls: ['./bitcup.component.css']
})
export class BitcupComponent implements OnInit {

    sponsorsServiceVar: SponsorsService;
    event?: Event;

    constructor(private sponsorsService: SponsorsService, private eventService: EventService) {
        this.sponsorsServiceVar = sponsorsService;
        scroll(0, 0);
    }

    ngOnInit(): void {
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
