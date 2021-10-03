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
  message: FormControl = new FormControl('', [Validators.required, Validators.maxLength(256)]);
  honeypot: FormControl = new FormControl(''); // we will use this to prevent spam
  destinations: string[] = ['administration', 'courses'];
  destination: FormControl = new FormControl(this.destinations[0]);
  submitted = false; // show and hide the success message
  isLoading = false; // disable the submit button if we're loading
  responseMessage: string; // the response message to show to the user

  constructor(private formBuilder: FormBuilder, private http: HttpClient, public translate: TranslateService) {
    scroll(0, 0);
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/) ? browserLang : 'en');

    this.form = this.formBuilder.group({
      name: this.name,
      email: this.email,
      message: this.message,
      honeypot: this.honeypot,
      destination: this.destination
    });
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }





  ngOnInit(): void {
  }
  onSubmit() {
    if (this.form.status === 'VALID' && this.honeypot.value === '') {
      this.form.disable(); // disable the form if it's valid to disable multiple submissions
      const formData: any = new FormData();
      formData.append('name', this.form.get('name').value);
      formData.append('email', this.form.get('email').value);
      formData.append('message', this.form.get('message').value);
      formData.append('destination', this.form.get('destination').value);
      this.isLoading = true; // sending the post request async so it's in progress
      this.submitted = false; // hide the response message on multiple submits
      this.http.post('https://script.google.com/macros/s/AKfycbx_ubNpBWnhHrziPB_tUYH7WrqzA4TaQmKKgjfFEKFeuR9YT35X9a1Ok0B3hGCyqTAPjA/exec',
        formData).subscribe(
        ( response) => {
          // choose the response message
          if (response['result'] === 'success') {
            this.responseMessage = 'Thanks for the message! I\'ll get back to you soon!';
          } else {
            this.responseMessage = 'Oops! Something went wrong... Reload the page and try again.';
          }
          this.form.enable(); // re enable the form after a success
          this.submitted = true; // show the response message
          this.isLoading = false; // re enable the submit button
          console.log(response);
        },
        (error) => {
          this.responseMessage = 'Oops! An error occurred... Reload the page and try again.';
          this.form.enable(); // re enable the form after a success
          this.submitted = true; // show the response message
          this.isLoading = false; // re enable the submit button
          console.log(error);
        }
      );
    }
  }

}
