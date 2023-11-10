import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, FormControlName} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
    form: FormGroup;
    name: FormControl = new FormControl('', [Validators.required]);
    email: FormControl = new FormControl('', [Validators.required, Validators.email]);
    message: FormControl = new FormControl('', [Validators.required, Validators.maxLength(350)]);
    honeypot: FormControl = new FormControl(''); // we will use this to prevent spam
    destinations: string[] = ['administration', 'courses'];
    destination: FormControl = new FormControl(this.destinations[0]);
    submitted = false; // show and hide the success message
    isLoading = false; // disable the submit button if we're loading
    responseMessage: string; // the response message to show to the user
    
    response_ok: string;
    response_error: string;

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private translate: TranslateService) {
        scroll(0, 0);

        this.form = this.formBuilder.group({
            name: this.name,
            email: this.email,
            message: this.message,
            honeypot: this.honeypot,
            destination: this.destination
        });
    }

    ngOnInit(): void { 
        this.translate.get('CONTACT.OK_RESPONSE').subscribe(res => {
            this.response_ok = res;
        });
        this.translate.get('CONTACT.ERROR_RESPONSE').subscribe(res => {
            this.response_error = res;
        });
    }

    onSubmit() {
        if (this.form.status === 'VALID' && this.honeypot.value === '') {
            this.form.disable(); // disable the form if it's valid to disable multiple submissions
            const formData: any = {};
            formData.name = this.form.get('name').value;
            formData.email = this.form.get('email').value;
            formData.message = this.form.get('message').value;
            formData.destination = this.form.get('destination').value;
            this.isLoading = true; // sending the post request async so it's in progress
            this.submitted = false; // hide the response message on multiple submits
            this.http.post('https://script.google.com/macros/s/AKfycbyYZEUsEW6KOJyrQMRYf0_GM55k_8DktIj1VwY-XQ-WW5EKtWytixoYF6uuGOrhU0rQUQ/exec', JSON.stringify(formData), {
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                }})
                .subscribe({
                    next: (response: any) => {
                        this.form.enable(); // re enable the form after a success
                        this.submitted = true; // show the response message
                        this.isLoading = false; // re enable the submit button
                        if (response.ok) this.responseMessage = this.response_ok;
                        else this.responseMessage = this.response_error;
                    },
                    error: (error: any) => {
                        this.responseMessage = this.response_error;
                        this.form.enable(); // re enable the form after a success
                        this.submitted = true; // show the response message
                        this.isLoading = false; // re enable the submit button
                    },
                });
        }
    }

}