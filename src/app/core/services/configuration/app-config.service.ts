import { Injectable } from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';


export interface PaletteColors {
  background: string;
  underlying: string;
  hover: string;
}


@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
  private paletteColorsSource = new BehaviorSubject<PaletteColors>({
    background: '#00629BFF', // default background color
    underlying: '#00B5E2FF', // default underlying color
    hover: '#3381AFFF'            // default hover color
  });

  constructor(private titleService: Title, private translate: TranslateService, private router: Router) {
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.resetTitle();
      this.resetPaletteColors();
    });
  }

    // title tiene que ser un codigo i18n
    setTitle(title: string) {
        this.translate.get(title).subscribe((res: string) => {
            this.titleService.setTitle(res);
        });
    }

    resetTitle() {
        this.translate.get('DEFAULT.PAGETITLE').subscribe((res: string) => {
            this.titleService.setTitle(res);
        });
    }

  // Tiene que ser de tipo RGB, RGBA o HEX en formato CSS
  setPaletteColors(colors: PaletteColors) {
    this.paletteColorsSource.next(colors);
  }

  resetPaletteColors() {
    this.paletteColorsSource.next({
      background: '#00629BFF',
      underlying: '#00B5E2FF',
      hover: '#3381AFFF'
    });
  }

  getPaletteColors() {
    return this.paletteColorsSource.asObservable();
  }
}
