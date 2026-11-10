import { Injectable } from '@angular/core';
import { Auth, getIdToken } from '@angular/fire/auth';
import { environment } from '../../../../environments/environment';
import { mailingFunctionsUrl } from '../../../secrets';

export interface SenderGroup {
    id: string;
    title: string;
}

@Injectable({ providedIn: 'root' })
export class MailingService {
    private readonly useMock = !environment.production; // solo en desarrollo
    constructor(private auth: Auth) {}

    private async call<T>(fn: string, body: unknown): Promise<T> {
        if (!mailingFunctionsUrl) throw new Error('El servicio de mailing todavía no está configurado');
        const user = this.auth.currentUser;
        if (!user) throw new Error('No hay sesión iniciada');
        const idToken = await getIdToken(user);
        const res = await fetch(`${mailingFunctionsUrl}/${fn}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
            body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
        return data as T;
    }

    async getGroups(): Promise<SenderGroup[]> {
        if (this.useMock) {
            return [
                { id: 'mock-a', title: 'Prueba A (mock)' },
                { id: 'mock-b', title: 'Prueba B (mock)' },
            ];
        }
        return this.call<SenderGroup[]>('sender-admin', { action: 'groups' });
    }

    async sendCampaign(subject: string, html: string, groups: string[]): Promise<{ ok: boolean; id: string }> {
        if (this.useMock) {
            console.log('[MAILING MOCK] Se mandaría este mail:', { subject, groups, html });
            await new Promise(resolve => setTimeout(resolve, 800));
            return { ok: true, id: 'mock' };
        }
        return this.call('sender-admin', { action: 'send', subject, html, groups });
    }
}
