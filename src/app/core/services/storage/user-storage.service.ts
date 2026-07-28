import {Injectable} from "@angular/core";
import {AuthService} from "../authorization/auth.service";

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {

    // This service asks for userId in order to stay synchronous
    // keeping localStorage operations synchronous.
    constructor() {}

    private key(userId: string, key: string): string {
        return `${userId}:${key}`;
    }

    get(userId: string, key: string): unknown | null {
        return JSON.parse(localStorage.getItem(this.key(userId, key)) ?? 'null');
    }

    set(userId: string, key: string, value: unknown): void {
        localStorage.setItem(this.key(userId, key), JSON.stringify(value));
    }

    remove(userId: string, key: string): void {
        localStorage.removeItem(this.key(userId, key));
    }
}
