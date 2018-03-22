import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Cell } from '../models/Cell';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CellService {

    constructor(
        private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
        private http: Http, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getCellCount(): Observable<number> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/cells/count`, { headers });
    }

    getCells(): Observable<Cell[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/cells`, { headers });
    }

    getCell(cellId: number): Observable<Cell> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/cells/` + cellId, { headers });
    }

    deleteCell(cell: Cell): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.delete(`${this.baseUrl}/api/cells/` + cell.id, { headers });
    }

    updateCell(cell: Cell): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.put(`${this.baseUrl}/api/cells/` + cell.id, cell, { headers });
    }

    addCell(newCellName: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.post(`${this.baseUrl}/api/cells`, { name: newCellName });
    }
}
