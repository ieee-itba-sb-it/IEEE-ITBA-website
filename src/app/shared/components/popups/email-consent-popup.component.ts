import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/authorization/auth.service';

@Component({
    selector: 'app-email-consent-popup',
    templateUrl: './email-consent-popup.component.html',
    // Reusamos los estilos del popup de eventos para que se vean iguales
    styleUrls: ['./event-popup.component.css', './email-consent-popup.component.css'],
})
export class EmailConsentPopupComponent {
    show$: Observable<boolean>;
    saving = false;

    constructor(private authService: AuthService) {
        this.show$ = this.authService.needsEmailConsent();
    }

    answer(emailConsent: boolean): void {
        this.saving = true;
        this.authService.saveEmailConsent(emailConsent).subscribe({
            error: (err) => {
                console.error(err);
                this.saving = false;
            },
            complete: () => this.saving = false,
        });
    }
}
