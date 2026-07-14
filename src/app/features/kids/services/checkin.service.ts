import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

export interface CheckinRecord {
    id: number;
    uuid: string;
    kid_id: number;
    checkin_date: string;
    checkout_date: string | null;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface CheckinWithKid extends CheckinRecord {
    kid_name?: string;
    kid_lastname?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CheckinService {

    private http = inject(HttpClient);
    private url = environment.urlApi;

    getTodayCheckins(): Observable<{ checkins: CheckinRecord[] }> {
        return this.http.get<{ checkins: CheckinRecord[] }>(`${this.url}/checkinAndOut/index`);
    }

    getCheckinsByKid(kidId: number): Observable<{ checkins: CheckinRecord[] }> {
        return this.http.get<{ checkins: CheckinRecord[] }>(`${this.url}/checkinAndOut/index/${kidId}`);
    }
}

