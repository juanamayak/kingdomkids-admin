import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private url = environment.urlApi;

    public jwtToken = 'VdiuajS4DLTUHg';
    public profileToken = 'PF849!';
    public permissionsToken = 'PM1995!';
    public developerToken = 'DV1936!';
    public corpToken = 'CP12345!';
    public permissionId = 'PID9842!';
    public lastUser = 'LU0712V!';

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {
    }

    login(data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/login`, data);
    }

    logout() {
        sessionStorage.clear();
        this.router.navigate(['auth/login']);
    }

    changePassword(userUuid: string, data: any): Observable<any> {
        return this.httpClient.put(`${this.url}/users/update/password/${userUuid}`, data);
    }

    getToken() {
        const token = sessionStorage.getItem(this.jwtToken);

        if (token) {
            return token;
        }

        return null;
    }
}
