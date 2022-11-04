import { Injectable } from '@angular/core';
import { Sponsor } from 'src/app/shared/models/sponsors';

@Injectable({
  providedIn: 'root'
})

export class SponsorsService {
  imgSrcPrefix = '../../../assets/image/content/';

  currentSponsors: Sponsor[] = [
    {
      name: 'Hitachi Energy',
      img: this.imgSrcPrefix + 'hitachi-energy.png'
    },
    {
      name: 'Inclusion',
      img: this.imgSrcPrefix + 'inclusion.png'
    },
    {
      name: 'Innovid',
      img: this.imgSrcPrefix + 'innovid.png'
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

  previousSponsors: Sponsor[] = [
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
    }
  ];

  ieextremeSponsors: Sponsor[] = [
    {
      name: 'Hitachi Energy',
      img: this.imgSrcPrefix + 'hitachi-energy.png'
    },
    {
      name: 'Inclusion',
      img: this.imgSrcPrefix + 'inclusion.png'
    },
    {
      name: 'Innovid',
      img: this.imgSrcPrefix + 'innovid.png'
    },
    {
      name: 'JPMorgan',
      img: this.imgSrcPrefix + 'jpmorgan.png'
    }
  ];

  bitCupSponsors: Sponsor[] = [
    {
      name: 'Axion Energy',
      img: this.imgSrcPrefix + 'axion-energy.png'
    },
    {
      name: 'Flowics',
      img: this.imgSrcPrefix + 'flowics.png'
    },
    {
      name: 'Innovid',
      img: this.imgSrcPrefix + 'innovid.png'
    },
    {
      name: 'JPMorgan',
      img: this.imgSrcPrefix + 'jpmorgan.png'
    },
    {
      name: 'Pan American Energy',
      img: this.imgSrcPrefix + 'pan-american-energy.png'
    }
  ];

  analisisSponsors: Sponsor[] = [
    {
      name: 'Axion Energy',
      img: this.imgSrcPrefix + 'axion-energy.png'
    },
    {
      name: 'Flowics',
      img: this.imgSrcPrefix + 'flowics.png'
    },
    {
      name: 'Innovid',
      img: this.imgSrcPrefix + 'innovid.png'
    },
    {
      name: 'JPMorgan',
      img: this.imgSrcPrefix + 'jpmorgan.png'
    },
    {
      name: 'Pan American Energy',
      img: this.imgSrcPrefix + 'pan-american-energy.png'
    }
  ];

  asimovSponsors: Sponsor[] = [
    {
      name: 'Schneider Electric',
      img: this.imgSrcPrefix + 'Schneider Logo.png'
    }
  ];


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

  getBitCupSponsors() {
    return this.bitCupSponsors;
  }

  getAnalisisSponsors() {
    return this.analisisSponsors;
  }

  getAsimovSponsors() {
    return this.asimovSponsors;
  }
}
