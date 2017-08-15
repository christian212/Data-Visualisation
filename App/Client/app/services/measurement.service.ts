import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
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
        return this.transferHttp.get(`${this.baseUrl}/api/measurements/count`);
    }

    getMeasurements(): Observable<Measurement[]> {
        return this.transferHttp.get(`${this.baseUrl}/api/measurements`);
    }

    getMeasurement(measurementId: number): Observable<Measurement> {
        return this.transferHttp.get(`${this.baseUrl}/api/measurements/` + measurementId);
    }

    getLocus(measurementId: number): Observable<any> {
        return this.transferHttp.get(`${this.baseUrl}/api/measurements/locus/` + measurementId);
    }

    getTimeSeries(measurementId: number, lowerBound: number = 0, upperBound: number = 0): Observable<any> {
        return this.transferHttp.get(`${this.baseUrl}/api/measurements/timeseries/` + measurementId + '/' + lowerBound + '/' + upperBound);
    }

    deleteMeasurement(measurement: Measurement): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/measurements/` + measurement.id);
    }

    updateMeasurement(measurement: Measurement): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/measurements/` + measurement.id, measurement);
    }

    addMeasurement(newMeasurementName: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/measurements`, { name: newMeasurementName });
    }
}
