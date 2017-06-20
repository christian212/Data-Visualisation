import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { IStack } from '../models/Stack';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StackService {
    constructor(
        private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
        private http: Http, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getStacks(): Observable<IStack[]> {
        // ** TransferHttp example / concept **
        //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
        //      The Client then re-uses this Http result instead of hitting the server again!

        //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
        return this.transferHttp.get(`${this.baseUrl}/api/stacks`);
    }

    getStack(stack: IStack): Observable<IStack> {
        return this.transferHttp.get(`${this.baseUrl}/api/stacks/` + stack.id);
    }

    deleteStack(stack: IStack): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/stacks/` + stack.id);
    }

    updateStack(stack: IStack): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/stacks/` + stack.id, stack);
    }

    addStack(newStackName: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/stacks`, { name: newStackName })
    }
}