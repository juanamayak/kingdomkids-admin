import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KidsService {
    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    public kidToken = 'X1uA4MkMU4UrLw';

    constructor() {
    }

    getKids(): Observable<any> {
        return this.httpClient.get(`${this.url}/register`);
    }

    getKidsAgeReport(age: number): Observable<any> {
        return this.httpClient.get(`${this.url}/reports/${age}`, {responseType: 'blob'});
    }

    public getConfirmationRegister(id: any): Observable<any> {
        return this.httpClient.get(`${this.url}/register/confirmation/${id}`);
    }
}
