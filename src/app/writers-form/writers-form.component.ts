import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-writers-form',
  templateUrl: './writers-form.component.html',
  styleUrls: ['./writers-form.component.css']
})
export class WritersFormComponent implements OnInit {

  constructor() {
    scroll(0, 0);
  }

  ngOnInit(): void {
  }

}
