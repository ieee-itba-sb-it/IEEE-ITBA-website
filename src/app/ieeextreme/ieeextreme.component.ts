import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ieeextreme',
  templateUrl: './ieeextreme.component.html',
  styleUrls: ['./ieeextreme.component.css']
})
export class IeeextremeComponent implements OnInit {

  constructor() {
    scroll(0,0);
  }

  ngOnInit(): void {
  }

}
