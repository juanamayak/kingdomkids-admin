import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class KidsService {

    private http = inject(HttpClient);
    private url = environment.urlApi;

    public kidToken = 'X1uA4MkMU4UrLw';

    getKids(): Observable<{ kids: Kid[] }> {
        return this.http.get<{ kids: Kid[] }>(`${this.url}/register`);
    }

    getKidsAgeReport(age: number): Observable<Blob> {
        return this.http.get(`${this.url}/reports/${age}`, { responseType: 'blob' });
    }

    getKidsByDateRangeReport(startDate: string, endDate: string): Observable<Blob> {
        return this.http.get(`${this.url}/reports/by-date`, {
            params: { startDate, endDate },
            responseType: 'blob',
        });
    }

    getConfirmationRegister(id: number): Observable<{ qr: string }> {
        return this.http.get<{ qr: string }>(`${this.url}/register/confirmation/${id}`);
    }
}

export interface Kid {
    id: number;
    name: string;
    lastname: string;
    birthday: string;
    age: number;
    allergy: number;
    medical_condition: number;
    mdf_member: number;
}

