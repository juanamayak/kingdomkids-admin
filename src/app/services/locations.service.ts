import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
    private httpClient = inject(HttpClient);
    private url = environment.urlApi;

    getCountries(): Observable<any> {
        return this.httpClient.get(`${this.url}/location/countries/index`);
    }

    getStates(countryId: any): Observable<any> {
        return this.httpClient.get(`${this.url}/location/states/${countryId}`);
    }

    getCities(stateId: any): Observable<any> {
        return this.httpClient.get(`${this.url}/location/cities/${stateId}`);
    }
}
