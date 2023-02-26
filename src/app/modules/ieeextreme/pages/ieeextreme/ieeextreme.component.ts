import { Component, OnInit } from '@angular/core';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';

@Component({
  selector: 'app-ieeextreme',
  templateUrl: './ieeextreme.component.html',
  styleUrls: ['./ieeextreme.component.css']
})
export class IeeextremeComponent implements OnInit {

  sponsorsServiceVar: SponsorsService;

  contacts = [
    {
      name: 'Brisa Rojas Silva',
      mail: 'brojas@itba.edu.ar'
    },
    {
      name: 'Nicolas Bustelo',
      mail: 'nbustelo@itba.edu.ar'
    }
  ];

  constructor(private sponsorsService: SponsorsService) {
    scroll(0, 0);
    this.sponsorsServiceVar = sponsorsService;
  }

  ngOnInit(): void {
  }

}
