import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    private http = inject(HttpClient);
    private router = inject(Router);
    private url = environment.urlApi;

    public jwtToken = 'VdiuajS4DLTUHg';

    login(data: { username: string; password: string }): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.url}/login`, data);
    }

    logout(): void {
        sessionStorage.clear();
        this.router.navigate(['auth/login']);
    }

    changePassword(userUuid: string, data: { password: string; confirm_password: string }): Observable<void> {
        return this.http.put<void>(`${this.url}/users/update/password/${userUuid}`, data);
    }

    getToken(): string | null {
        return sessionStorage.getItem(this.jwtToken);
    }
}
