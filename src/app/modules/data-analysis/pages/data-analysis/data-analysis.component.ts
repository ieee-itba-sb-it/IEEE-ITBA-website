import { Component, OnInit } from '@angular/core';

import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import { Timestamp } from '@angular/fire/firestore';
import {CourseWithTests} from '../../../../shared/models/courses/course-with-tests';

@Component({
    selector: 'app-data-analysis',
    templateUrl: './data-analysis.component.html',
    styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {
    sponsorsServiceVar: SponsorsService;

    enrollOpen = '11 Sep 2023 03:00:00 UTC';
    enrollClose = '18 Sep 2023 03:00:00 UTC';
    classes = ['18 Sep 2023 03:00:00 UTC', '25 Sep 2023 03:00:00 UTC'];
    courseEnd = '02 Oct 2023 03:00:00 UTC';
    testsOpen = '09 Oct 2023 03:00:00 UTC';

    courseData: CourseWithTests = {
        enrollLink: 'https://forms.gle/BiCzJWPADYmQwYvFA',
        enrollDates: {
            open: new Date(this.enrollOpen),
            close: new Date(this.enrollClose)
        },
        endDate: new Date(this.courseEnd),
        courseClasses: [
            {
                openDate: new Date(this.classes[0]),
                content: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Clases/Clase_1_Analisis_de_Datos.ipynb',
                solutions: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Solucionarios/Solucionario_Clase_1.ipynb',
                description: 'DATAANALYSIS.CLASSES.C1'
            },
            {
                openDate: new Date(this.classes[1]),
                content: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Clases/Clase_2_Analisis_de_Datos.ipynb',
                solutions: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Solucionarios/Solucionario_Clase_2.ipynb',
                description: 'DATAANALYSIS.CLASSES.C2'
            }
        ],
        daysOpenAfterFinish: 30,
        contentCloseDate: null,
        testDates: {
            open: new Date(this.testsOpen),
            close: null
        },
        tests: [
            'http://go.ieeeitba.org.ar/CANDA_Quiz_1',
            'http://go.ieeeitba.org.ar/CANDA_Quiz_2',
            'http://go.ieeeitba.org.ar/CANDA_Quiz_3',
            'http://go.ieeeitba.org.ar/CANDA_Quiz_4',
            'http://go.ieeeitba.org.ar/CANDA_Quiz_5',
            'http://go.ieeeitba.org.ar/CANDA_Quiz_6',
            'http://go.ieeeitba.org.ar/CANDA_Quiz_7'
        ]
    };

    constructor(private sponsorsService: SponsorsService) {
        this.sponsorsServiceVar = sponsorsService;
        scroll(0, 0);

        this.courseData.testDates.close = new Date(this.courseData.testDates.open);
        this.courseData.testDates.close.setDate(this.courseData.testDates.close.getDate() + this.courseData.tests.length);

        this.courseData.contentCloseDate = new Date(this.courseData.endDate);
        this.courseData.contentCloseDate.setDate(this.courseData.contentCloseDate.getDate() + this.courseData.daysOpenAfterFinish);
    }

    isOldDate(date: Date) {
        const oldDate = Timestamp.fromDate(date);
        const now = Timestamp.now();
        return now > oldDate;
    }

    getCurrentTest() {
        const now = Timestamp.now();

        for (let days = this.courseData.tests.length-1 ; days >= 0 ; days--) {
            let testDate = new Date(this.courseData.testDates.open);
            testDate.setDate(testDate.getDate() + days);
            if (now > Timestamp.fromDate(testDate)) {
                return this.courseData.tests[days];
            }
        }

        // Fallback, should not happen
        return '';
    }

    weekContentOpen(weekIdx: number) {
        return (weekIdx < this.courseData.courseClasses.length && this.isOldDate(this.courseData.courseClasses[weekIdx].openDate)
              || this.isOldDate(this.courseData.endDate))
          && !this.isOldDate(this.courseData.contentCloseDate);
    }

    isContentClosed() {
        return this.isOldDate(this.courseData.contentCloseDate);
    }

    isBetweenDates(startDate: Date, endDate: Date) {
        const now = Timestamp.now();
        return Timestamp.fromDate(startDate) < now && now < Timestamp.fromDate(endDate);
    }

    hasTestsAvailable() {
        return this.isBetweenDates(this.courseData.testDates.open, this.courseData.testDates.close);
    }

    enrollAvailable() {
        return this.isBetweenDates(this.courseData.enrollDates.open, this.courseData.enrollDates.close);
    }

    check = (event, isReady) => {
        if (!isReady) {
            event.preventDefault();
        }
    }

    ngOnInit(): void {
    }

}
