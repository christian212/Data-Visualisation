import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { HomeDetails } from '../models/home.details.interface'; 
import { ConfigService } from '../../shared/utils/config.service';

import {BaseService} from '../../shared/services/base.service';

import { Observable } from 'rxjs/Rx';

//import * as _ from 'lodash';

// Add the RxJS Observable operators we need in this app.
import '../../rxjs-operators';
import { ORIGIN_URL } from '../../shared/constants/baseurl.constants';

@Injectable()

export class DashboardService extends BaseService {


  constructor(private http: Http, private configService: ConfigService,
    @Inject(ORIGIN_URL) private baseUrl: string) {
     super();
  }

  getHomeDetails(): Observable<HomeDetails> {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let authToken = localStorage.getItem('auth_token');
      headers.append('Authorization', `Bearer ${authToken}`);
  
    return this.http.get(this.baseUrl + "/api/dashboard/home",{headers})
      .map(response => response.json())
      .catch(this.handleError);
  }  
}
