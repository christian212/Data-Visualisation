import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
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
        return this.transferHttp.get(`${this.baseUrl}/api/batteries/count`);
    }

    getBatteries(): Observable<Battery[]> {
        return this.transferHttp.get(`${this.baseUrl}/api/batteries`);
    }

    getBattery(batteryId: number): Observable<Battery> {
        return this.transferHttp.get(`${this.baseUrl}/api/batteries/` + batteryId);
    }

    deleteBattery(battery: Battery): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/batteries/` + battery.id);
    }

    updateBattery(battery: Battery): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/batteries/` + battery.id, battery);
    }

    addBattery(newBatteryName: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/batteries`, { name: newBatteryName });
    }
}
