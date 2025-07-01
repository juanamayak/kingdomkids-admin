import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LinksService {
    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    public contractToken = 'X1uA4MkMU4UrLw';

    sendLinkByTelephone(contractUuid: string, data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/send-link-sign/telephone/${contractUuid}`, data);
    }

    sendLinkByEmail(contractUuid: string, data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/send-link-sign/email/${contractUuid}`, data);
    }
}
