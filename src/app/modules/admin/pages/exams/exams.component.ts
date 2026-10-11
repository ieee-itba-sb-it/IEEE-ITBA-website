import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from 'src/app/core/services/event/event.service';
import { DataAnalysisUser } from 'src/app/shared/models/event/data_analysis/exams';

@Component({
    selector: 'app-exams-admin',
    templateUrl: './exams.component.html',
    styleUrls: ['./exams.component.css']
})
export class ExamsAdminComponent implements OnInit {

    students?: DataAnalysisUser[];

    constructor(private eventService: EventService, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.eventService.getDataAnalysisStudents().subscribe({
            next: students => this.students = students,
            error: () => {
                this.students = [];
                this.snackBar.open('No se pudieron cargar los alumnos.', 'Cerrar', { duration: 4000 });
            }
        });
    }
}
