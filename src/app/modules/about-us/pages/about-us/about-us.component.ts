import {Component, OnInit} from '@angular/core';
import { AppConfigService } from '../../../../core/services/configuration/app-config.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})

export class AboutUsComponent implements OnInit {

  constructor(private appConfigService: AppConfigService) {
    scroll(0, 0);
  }

  ngOnInit(): void {
    this.appConfigService.setTitle('ABOUTUS.PAGETITLE');
  }
}
