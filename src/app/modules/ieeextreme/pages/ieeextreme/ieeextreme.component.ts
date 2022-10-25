import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ieeextreme',
  templateUrl: './ieeextreme.component.html',
  styleUrls: ['./ieeextreme.component.css']
})
export class IeeextremeComponent implements OnInit {

  imgSrcPrefix = '../../../../../assets/image/sponsors/';

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

  sponsors = [
    {
      name: 'JPMorgan',
      img: this.imgSrcPrefix + 'jpmorgan.png'
    },
    {
      name: 'Innovid',
      img: this.imgSrcPrefix + 'innovid.png'
    },
    {
      name: 'Inclusion',
      img: this.imgSrcPrefix + 'inclusion.png'
    },
    {
      name: 'Hitachi Energy',
      img: this.imgSrcPrefix + 'hitachi-energy.png'
    }
  ];

  constructor() {
    scroll(0, 0);
  }

  ngOnInit(): void {
  }

}
