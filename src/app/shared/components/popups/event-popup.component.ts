import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../core/services/event/event.service';

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css'],
})
export class EventPopupComponent implements OnInit {
  events: any[] = [];
  showPopup: boolean = false;
  private readonly STORAGE_KEY = 'lastEventPopupTime';

  private readonly MAX_EVENTS_SHOWN = 2;
  private readonly MIN_EVENTS_SHOWN = 0;

  constructor(private popup: EventService) { }

  ngOnInit(): void {
    if (this.shouldShowPopup()) {
      this.popup.getUpcomingEvents().subscribe((data) => {
        if (data && data.length > this.MIN_EVENTS_SHOWN) {
          this.events = data.slice(0, this.MAX_EVENTS_SHOWN);

          setTimeout(() => {
            this.showPopup = true;
            this.setLastPopupTime();
          }, 2000);
        }
      });
    }
  }

  shouldShowPopup(): boolean {
    const lastTimeStr = localStorage.getItem(this.STORAGE_KEY);
    if (!lastTimeStr) return true;

    const lastTime = new Date(lastTimeStr).getTime();
    const now = new Date().getTime();
    const hoursSinceLastShow = (now - lastTime) / (1000 * 60 * 60);

    return hoursSinceLastShow >= 24 * 7;
  }

  setLastPopupTime(): void {
    localStorage.setItem(this.STORAGE_KEY, new Date().toISOString());
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
