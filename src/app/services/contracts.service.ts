import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContractsService {

    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    public contractToken = 'X1uA4MkMU4UrLw';

    createContract(data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/contracts/store`, data);
    }

    updateContract(contractUuid: string, data: any): Observable<any> {
        return this.httpClient.put(`${this.url}/contracts/update/${contractUuid}`, data);
    }

    getContractsByStatus(status: string): Observable<any> {
        return this.httpClient.get(`${this.url}/contracts/show/${status}`);
    }

    authorizeContract(contractUuid: string): Observable<any> {
        return this.httpClient.put(`${this.url}/contracts/authorize/${contractUuid}`, {});
    }

    sendContractToBuyBack(contractUuid: string): Observable<any> {
        return this.httpClient.put(`${this.url}/contracts/sent-to-buyback/${contractUuid}`, {});
    }

    requestContractCancellation(contractUuid: string): Observable<any> {
        return this.httpClient.put(`${this.url}/contracts/cancel-request/${contractUuid}`, {});
    }

    sendContractToTrash(contractUuid: string): Observable<any> {
        return this.httpClient.delete(`${this.url}/contracts/trash/${contractUuid}`);
    }
}
