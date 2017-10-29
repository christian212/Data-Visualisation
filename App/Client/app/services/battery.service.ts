import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Battery } from '../models/Battery';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BatteryService {

    constructor(
        private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
        private http: Http, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getBatteryCount(): Observable<number> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/batteries/count`, { headers });
    }

    getBatteries(): Observable<Battery[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/batteries`, { headers });
    }

    getBattery(batteryId: number): Observable<Battery> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/batteries/` + batteryId, { headers });
    }

    deleteBattery(battery: Battery): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.delete(`${this.baseUrl}/api/batteries/` + battery.id, { headers });
    }

    updateBattery(battery: Battery): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.put(`${this.baseUrl}/api/batteries/` + battery.id, battery, { headers });
    }

    addBattery(newBatteryName: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        console.log(`Get JWT token from localStorage: ${authToken}`);

        return this.http.post(`${this.baseUrl}/api/batteries`, { name: newBatteryName });
    }
}
