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
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

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
    color: string;

    constructor(private eventService: EventService, public modalRef: MDBModalRef, private appConfigService: AppConfigService) { }

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

    getColor() {
        this.appConfigService.getPaletteColors().subscribe(
            palletColors => {
                this.color = palletColors.background;
            }
        );
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
        this.getColor();
    }

    get date() {
        return this.eventForm.get('date');
    }

    async updateEvent() {
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
        const updated = await this.eventService.updateEvent(this.event);
        if (updated) {
            this.errorI18n = null;
            this.modalRef.hide();
        } else {
            this.errorI18n = 'HOME.EVENTS.EDIT.ERROR.UPDATE';
        }
        this.loading = false;
    }

}
