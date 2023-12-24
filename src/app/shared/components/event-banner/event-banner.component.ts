import { Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-event-banner',
    templateUrl: './event-banner.component.html',
    styleUrls: ['./event-banner.component.css']
})

export class EventBannerComponent implements OnInit{
  @Input() url: string;
  @Input() alt: string;
  
  constructor() { }

  ngOnInit(): void {
      this.url = "../../../../../assets/image/" + this.url;
  }
}
