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
        },
        {
            name: 'DevRev',
            img: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2Fdevrev-logo_black.png?alt=media&token=d5eb5bc7-3862-4af7-98f1-2223d4920625'
        },
        {
            name: 'Yokogawa',
            img: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2Fyokogawa.jpg?alt=media&token=300f278f-2e30-4964-b875-84ddccfdb2b0'
        },
        // {
        //     name: 'Le Wagon',
        //     img: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2Flewagon.png?alt=media&token=8afe5950-44ab-4f5f-89aa-ad0c62e524b3'
        // }
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
        },
        {
            name: 'DevRev',
            img: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2Fdevrev-logo_black.png?alt=media&token=d5eb5bc7-3862-4af7-98f1-2223d4920625'
        },
        {
            name: 'Yokogawa',
            img: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2Fyokogawa.png?alt=media&token=4cad97a1-6525-431b-a9a4-3576c130efe5'
        },
        // {
        //     name: 'Le Wagon',
        //     img: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2Flewagon.png?alt=media&token=8afe5950-44ab-4f5f-89aa-ad0c62e524b3'
        // }
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
