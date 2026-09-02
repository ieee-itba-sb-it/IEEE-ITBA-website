import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { senderApiKey } from '../../../secrets';

@Injectable({
  providedIn: 'root',
})
export class SenderService {
  private readonly baseUrl = 'https://api.sender.net/v2/subscribers';

  constructor(private http: HttpClient) {}

  /**
   * Syncs user newsletter preference directly with Sender.net REST API.
   * If senderApiKey is missing, logs a safe notice and completes without failing.
   */
  syncSubscriber(
    email: string,
    fullname: string = '',
    subscribed: boolean = true
  ): Observable<{ success: boolean; data?: any; error?: any }> {
    if (!email) {
      return of({ success: false, error: 'Email is required' });
    }

    if (!senderApiKey || senderApiKey.trim() === '') {
      console.warn(
        `[SenderService] senderApiKey is empty. Skipping Sender.net sync for ${email}.`
      );
      return of({ success: true, data: { status: 'mocked_no_key' } });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${senderApiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    if (subscribed) {
      const body = {
        email: email,
        firstname: fullname,
      };

      return this.http.post(this.baseUrl, body, { headers }).pipe(
        map((response) => ({ success: true, data: response })),
        catchError((error) => {
          console.error('[SenderService] Error subscribing user to Sender.net:', error);
          return of({ success: false, error });
        })
      );
    } else {
      // Unsubscribe user
      const deleteUrl = `${this.baseUrl}/${encodeURIComponent(email)}`;
      return this.http.delete(deleteUrl, { headers }).pipe(
        map((response) => ({ success: true, data: response })),
        catchError((error) => {
          console.error('[SenderService] Error unsubscribing user from Sender.net:', error);
          return of({ success: false, error });
        })
      );
    }
  }
}
