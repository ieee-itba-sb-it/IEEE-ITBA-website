import { Component } from "@angular/core";
interface Exam{
    id:number;
    title:string;
    available:boolean;
    attempts:number;
    passed:boolean;
}

@Component({
    selector: "app-exam-list",
    templateUrl: "./exam-list.component.html",
    styleUrls: ["./exam-list.component.css"]
})
export class ExamListComponent{
    exams:Exam[] = [
        { id: 1, title: 'Día 1', available: true, attempts: 0, passed: false },
        { id: 2, title: 'Día 2', available: false, attempts: 0, passed: false },
        { id: 3, title: 'Día 3', available: false, attempts: 0, passed: false },
        { id: 4, title: 'Día 4', available: false, attempts: 0, passed: false },
        { id: 5, title: 'Día 5', available: false, attempts: 0, passed: false },
        { id: 6, title: 'Día 6', available: false, attempts: 0, passed: false },
        { id: 7, title: 'Día 7', available: false, attempts: 0, passed: false }
    ];
}
