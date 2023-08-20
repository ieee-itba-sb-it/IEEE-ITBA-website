import { Component, Input, OnInit } from '@angular/core';
import { StudentChapter } from '../../models/student-chapters/student-chapter.types';

@Component({
  selector: 'app-student-chapter-card',
  templateUrl: './student-chapter.component.html',
  styleUrls: ['./student-chapter.component.css']
})
export class StudentChapterComponent implements OnInit {

  @Input() studentChapter: StudentChapter;

  constructor() {}

  ngOnInit(): void {
  }

}
