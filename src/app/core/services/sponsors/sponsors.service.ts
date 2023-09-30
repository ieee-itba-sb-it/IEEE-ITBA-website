import { Injectable } from '@angular/core';
import { Sponsor } from 'src/app/shared/models/sponsors';

@Injectable({
  providedIn: 'root'
})

export class SponsorsService {
  imgSrcPrefix = '../../../assets/image/sponsors/';

  currentSponsors: Sponsor[] = [
    {
      name: 'Innovid',
      img: this.imgSrcPrefix + 'innovid.png'
    }
  ];

  previousSponsors: Sponsor[] = [
    {
      name: 'Inclusion',
      img: this.imgSrcPrefix + 'inclusion.png'
    },
    {
      name: 'Hitachi Energy',
      img: this.imgSrcPrefix + 'hitachi-energy.png'
    },
    {
      name: 'Axion Energy',
      img: this.imgSrcPrefix + 'axion-energy.png'
    },
    {
      name: 'Eiwa',
      img: this.imgSrcPrefix + 'eiwa.png'
    },
    {
      name: 'Flowics',
      img: this.imgSrcPrefix + 'flowics.png'
    },
    {
      name: 'Mulesoft',
      img: this.imgSrcPrefix + 'mulesoft.png'
    },
    {
      name: 'Pampa Energia',
      img: this.imgSrcPrefix + 'pampa.png'
    },
    {
      name: 'Pan American Energy',
      img: this.imgSrcPrefix + 'pan-american-energy.png'
    },
    {
      name: 'TGS',
      img: this.imgSrcPrefix + 'tgs.png'
    },
    {
      name: 'JPMorgan',
      img: this.imgSrcPrefix + 'jpmorgan.png'
    },
    {
      name: 'Schneider Electric',
      img: this.imgSrcPrefix + 'Schneider Logo.png'
    }
  ];

  ieextremeSponsors: Sponsor[] = [
    {
      name: 'Innovid',
      img: this.imgSrcPrefix + 'innovid.png'
    }
  ];

  asimovSponsors: Sponsor[] = [];
  /*
    {
      name: 'Schneider Electric',
      img: this.imgSrcPrefix + 'Schneider Logo.png'
    }
  ];
   */


  constructor() { }

  getCurrentSponsors() {
    return this.currentSponsors;
  }

  getPreviousSponsors() {
    return this.previousSponsors;
  }

  getIeextremeSponsors() {
    return this.ieextremeSponsors;
  }

  getAsimovSponsors() {
    return this.asimovSponsors;
  }
}
