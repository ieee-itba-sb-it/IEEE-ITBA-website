import { Injectable } from '@angular/core';
import { StudentChapter } from '../../../shared/models/student-chapters/student-chapter.types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentChaptersService {
  private studentChapters$ = new BehaviorSubject<StudentChapter[]>([
    {
      name: 'emb',
      img: '/assets/image/emb/IEEE_EMBS_logo.png',
      url: '/emb',
      description: 'EMB\.ABOUTEMB\.CONTENT1',
    },
    {
      name: 'wie',
      img: '/assets/image/wie/wie_logo_zoomed_out.svg',
      url: '/wie',
      color: 'var(--bs-ieee-dark-purple)',
      description: 'WIE\.WHATIS\.SHORTCONTENT',
    },
    {
      name: 'cs',
      img: '/assets/image/cs/cslogo.png',
      url: 'https://csitba.web.app/',
      color: 'var(--bs-ieee-bright-orange)',
      description: 'CS\.ABOUT',
    },
    {
      name: 'ras',
      img: '/assets/image/ras/IEEE_RAS_logo_4C_stacked-HiRes.png',
      url: '/ras',
      color: 'var(--bs-ieee-dark-red)',
      description: 'RAS\.ABOUTRAS\.SHORTCONTENT',
    }
  ]);

  public getStudentChapters(): Observable<StudentChapter[]> {
    return this.studentChapters$;
  }
}
