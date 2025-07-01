import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FilesService {

    private url = environment.urlApi;
    private httpClient = inject(HttpClient);

    constructor() {
    }

    downloadPDFContract(contractUuid: string, fileType: string) {
        return this.httpClient.get(`${this.url}/files/download/${contractUuid}/${fileType}`, { responseType: 'blob' })
    }

    generatePDFContract(contractUuid: string) {
        return this.httpClient.get(`${this.url}/contracts/generate-format/${contractUuid}`, { responseType: 'blob' })
    }

    uploadPDFFiles(contractUuid: string, data: any, fileType: string): Observable<any> {
        return this.httpClient.post(`${this.url}/files/upload/${contractUuid}/${fileType}`, data);
    }
}
