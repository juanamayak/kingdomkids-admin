import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    public contractToken = 'X1uA4MkMU4UrLw';

    updateClient(clientUuid: string, data: any): Observable<any> {
        return this.httpClient.put(`${this.url}/clients/update/${clientUuid}`, data);
    }

    getClientEmails(clientUuid: string): Observable<any> {
        return this.httpClient.get(`${this.url}/clients/get-emails/${clientUuid}`);
    }

    getClientTelephones(clientUuid: string): Observable<any> {
        return this.httpClient.get(`${this.url}/clients/get-telephones/${clientUuid}`);
    }
}
