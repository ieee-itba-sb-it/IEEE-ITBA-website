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
    loading = false;

    constructor(private eventService: EventService, public modalRef: MDBModalRef) { }

    private getIsoDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private getToday(): Date {
        return new Date(this.getIsoDate(new Date()));
    }

    nonPastDateValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const date = new Date(control.value);
            const today = this.getToday();
            if (date < today) {
                return { pastDate: { value: control.value } };
            }
            return null;
        }
    }

    ngOnInit(): void {
        const initialDate = (this.event.dates && this.event.dates.length > 0) ?
            this.getIsoDate(this.event.dates[0].date) :
            null;
        this.eventForm = new FormGroup({
            date: new FormControl(initialDate, [
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
        const newDate = new Date(this.date.value);
        if (!this.event.dates || this.event.dates.length === 0) {
            this.event.dates = [{ date: newDate }];
        } else {
            this.event.dates[0].date = newDate;
        }
        this.loading = true;
        this.eventService.updateEvent(this.event)
            .subscribe((updated) => {
                if (updated) {
                    this.errorI18n = null;
                    this.modalRef.hide();
                } else {
                    this.errorI18n = 'HOME.EVENTS.EDIT.ERROR.UPDATE';
                }
                this.loading = false;
            });
    }

}
