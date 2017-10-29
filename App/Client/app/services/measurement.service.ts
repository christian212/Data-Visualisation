import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Measurement } from '../models/Measurement';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MeasurementService {

    constructor(
        private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
        private http: Http, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getMeasurementCount(): Observable<number> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/measurements/count`, { headers });
    }

    getMeasurements(): Observable<Measurement[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/measurements`, { headers });
    }

    getMeasurement(measurementId: number): Observable<Measurement> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/measurements/` + measurementId, { headers });
    }

    getLocus(measurementId: number): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/measurements/locus/` + measurementId, { headers });
    }

    getTimeSeries(measurementId: number, lowerBound: number = 0, upperBound: number = 0): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/measurements/timeseries/` + measurementId + '/' + lowerBound + '/' + upperBound, { headers });
    }

    getRawTimeSeries(measurementId: number, index: number, lowerBound: number = 0, upperBound: number = 0): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.transferHttp.get(`${this.baseUrl}/api/measurements/rawtimeseries/` + measurementId + '/' + index + '/' + lowerBound + '/' + upperBound, { headers });
    }

    deleteMeasurement(measurement: Measurement): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.delete(`${this.baseUrl}/api/measurements/` + measurement.id, { headers });
    }

    updateMeasurement(measurement: Measurement): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.put(`${this.baseUrl}/api/measurements/` + measurement.id, measurement, { headers });
    }

    addMeasurement(newMeasurementName: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.post(`${this.baseUrl}/api/measurements`, { name: newMeasurementName });
    }
}
