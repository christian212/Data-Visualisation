import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Stack } from '../models/Stack';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StackService {

    constructor(
        private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
        private http: Http, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getStackCount(): Observable<number> {
        return this.transferHttp.get(`${this.baseUrl}/api/stacks/count`);
    }

    getStacks(): Observable<Stack[]> {
        return this.transferHttp.get(`${this.baseUrl}/api/stacks`);
    }

    getStack(stackId: number): Observable<Stack> {
        return this.transferHttp.get(`${this.baseUrl}/api/stacks/` + stackId);
    }

    deleteStack(stack: Stack): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/stacks/` + stack.id);
    }

    updateStack(stack: Stack): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/stacks/` + stack.id, stack);
    }

    addStack(newStackName: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/stacks`, { name: newStackName });
    }
}
