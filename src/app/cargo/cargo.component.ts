import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {
  @Input() cargo: string;
  @Input() nombre: string;
  @Input() apellido: string;
  @Input() email: string;
  @Input() linkedin: string;
  @Input() imageurl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
