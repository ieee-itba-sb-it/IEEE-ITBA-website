import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css'],
})
export class SponsorsComponent implements OnInit {

  sponsorsServiceVar: SponsorsService;

  constructor(private sponsorsService: SponsorsService) {
    this.sponsorsServiceVar = sponsorsService;
   }

  ngOnInit(): void {
  }

}
