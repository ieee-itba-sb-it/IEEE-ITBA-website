import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/pop-ups/popup.service'; 

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css'],
})
export class EventPopupComponent implements OnInit {
  events: any[] = [];
  showPopup: boolean = true;

  constructor(private popup: EventService) {}

  ngOnInit(): void {
    this.popup.getEvents().subscribe((data) => {
      console.log('Datos recibidos:', data);

      this.events = data.map(event => ({
        ...event,
        date: event.date ? (event.date.toDate ? event.date.toDate() : new Date(event.date)) : 'Fecha no disponible',
        imageUrl: event.imageUrl && event.imageUrl.trim() !== '' ? event.imageUrl : 'assets/placeholder.png'
      }));
    });
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
