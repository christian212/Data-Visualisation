import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
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
        return this.transferHttp.get(`${this.baseUrl}/api/cells/count`);
    }

    getCells(): Observable<Cell[]> {
        return this.transferHttp.get(`${this.baseUrl}/api/cells`);
    }

    getCell(cellId: number): Observable<Cell> {
        return this.transferHttp.get(`${this.baseUrl}/api/cells/` + cellId);
    }

    deleteCell(cell: Cell): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/cells/` + cell.id);
    }

    updateCell(cell: Cell): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/cells/` + cell.id, cell);
    }

    addCell(newCellName: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/cells`, { name: newCellName });
    }
}
