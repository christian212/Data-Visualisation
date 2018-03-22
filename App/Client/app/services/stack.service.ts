import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
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
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/stacks/count`, { headers });
    }

    getStacks(): Observable<Stack[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/stacks`, { headers });
    }

    getStack(stackId: number): Observable<Stack> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/stacks/` + stackId, { headers });
    }

    deleteStack(stack: Stack): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.delete(`${this.baseUrl}/api/stacks/` + stack.id, { headers });
    }

    updateStack(stack: Stack): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.put(`${this.baseUrl}/api/stacks/` + stack.id, stack, { headers });
    }

    addStack(newStackName: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.post(`${this.baseUrl}/api/stacks`, { name: newStackName });
    }
}
