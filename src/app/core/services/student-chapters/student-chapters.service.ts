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
      url: '/emb'
    },
    {
      name: 'wie',
      img: '/assets/image/wie/wie_logo_zoomed_out.svg',
      url: '/wie',
      color: '#702F8A'
    },
    {
      name: 'cs',
      img: '/assets/image/cs/cslogo.png',
      url: 'https://csitba.web.app/',
      color: '#FAA41A'
    },
    {
      name: 'ras',
      img: '/assets/image/ras/IEEE_RAS_logo_4C_stacked-HiRes.png',
      url: '/ras',
      color: '#862633'
    }
  ]);

  public getStudentChapters(): Observable<StudentChapter[]> {
    return this.studentChapters$;
  }
}
