import {Component, Input, OnInit} from '@angular/core';
import {EventCardData} from "../../models/event/event-card-data";
import {EventService} from "../../../core/services/event/event.service";
import {MDBModalRef} from "angular-bootstrap-md";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";

@Component({
    selector: 'app-event-editor-modal',
    templateUrl: './event-editor-modal.component.html',
    styleUrls: ['./event-editor-modal.component.css']
})
export class EventEditorModalComponent implements OnInit {

    @Input() event: EventCardData;
    eventForm: FormGroup;
    errorI18n: string = null;

    constructor(private eventService: EventService, public modalRef: MDBModalRef) { }

    nonPastDateValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const date = new Date(control.value);
            const now = new Date(new Date().toISOString().split('T')[0]);
            if (date < now) {
                return { pastDate: { value: control.value } };
            }
            return null;
        }
    }

    ngOnInit(): void {
        this.eventForm = new FormGroup({
            date: new FormControl(this.event.dates[0].date.toISOString().split('T')[0], [
                Validators.required,
                Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
                this.nonPastDateValidator()
            ])
        });
    }

    get date() {
        return this.eventForm.get('date');
    }

    updateEvent() {
        if (this.eventForm.invalid) {
            return;
        }
        this.event.dates[0].date = new Date(this.date.value);
        this.eventService.updateEvent(this.event)
            .subscribe((updated) => {
                if (updated) {
                    this.errorI18n = null;
                    this.modalRef.hide();
                } else {
                    this.errorI18n = 'HOME.EVENTS.EDIT.ERROR.SAVE';
                }
            });
    }

}
