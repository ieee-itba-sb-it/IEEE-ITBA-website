import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MailingService, SenderGroup } from 'src/app/core/services/mailing/mailing.service';

@Component({
    selector: 'app-mailing-admin',
    templateUrl: './mailing.component.html',
    styleUrls: ['./mailing.component.css']
})
export class MailingAdminComponent implements OnInit {
    groups: SenderGroup[] = [];
    selectedGroups: string[] = [];
    subject = '';
    html = '';
    sending = false;
    message = '';
    isError = false;

    quillConfig = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ header: [1, 2, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
        ],
    };

    constructor(private mailing: MailingService, private translate: TranslateService) {}

    async ngOnInit() {
        try {
            this.groups = await this.mailing.getGroups();
        } catch (e: any) {
            this.showMessage(this.translate.instant('ADMIN.MAILINGTAB.LOAD_ERROR') + ' ' + e.message, true);
        }
    }

    get canSend(): boolean {
        return !this.sending && !!this.subject.trim() && !!this.html && this.selectedGroups.length > 0;
    }

    async send() {
        const names = this.groups
            .filter(g => this.selectedGroups.includes(g.id))
            .map(g => g.title)
            .join(', ');
        const question = this.translate.instant('ADMIN.MAILINGTAB.CONFIRM', { subject: this.subject, groups: names });
        if (!confirm(question)) return;

        this.sending = true;
        this.message = '';
        try {
            await this.mailing.sendCampaign(this.subject, this.html, this.selectedGroups);
            this.showMessage(this.translate.instant('ADMIN.MAILINGTAB.SENT'), false);
            this.subject = '';
            this.html = '';
            this.selectedGroups = [];
        } catch (e: any) {
            this.showMessage(this.translate.instant('ADMIN.MAILINGTAB.SEND_ERROR') + ' ' + e.message, true);
        } finally {
            this.sending = false;
        }
    }

    private showMessage(text: string, isError: boolean) {
        this.message = text;
        this.isError = isError;
    }
}
