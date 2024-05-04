import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import {Event, IeeeEvent} from "../../../../shared/models/event/event";
import {EventService} from "../../../../core/services/event/event.service";

@Component({
    selector: 'app-ieeextreme',
    templateUrl: './ieeextreme.component.html',
    styleUrls: ['./ieeextreme.component.css']
})
export class IeeextremeComponent implements OnInit {

    event?: Event;

    sponsorsServiceVar: SponsorsService;

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

    constructor(private sponsorsService: SponsorsService, private eventService: EventService) {
        scroll(0, 0);
        this.sponsorsServiceVar = sponsorsService;
    }

    ngOnInit(): void {
        this.getEvent();
    }

    getEvent(): void {
        this.eventService.getEvent(IeeeEvent.IEEE_EXTREME)
            .subscribe(event => {
                this.event = event;
            });
    }

}
