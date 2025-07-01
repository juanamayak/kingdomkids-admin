import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SignaturesService {

    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    constructor() {
    }

    captureSignature(contractUuid: string, data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/signatures/capture/${contractUuid}`, data);
    }
}
