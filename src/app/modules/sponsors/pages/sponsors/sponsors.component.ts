import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css'],
})
export class SponsorsComponent implements OnInit {

  imgSrcPrefix = '../../../../../assets/image/content/';

  currentSponsors = [
    {
      name: 'JPMorgan',
      img: this.imgSrcPrefix + 'jpmorgan.png'
    },
    {
      name: 'Schneider Electric',
      img: this.imgSrcPrefix + 'Schneider Logo.png'
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

  constructor() { }

  ngOnInit(): void {
  }

}
