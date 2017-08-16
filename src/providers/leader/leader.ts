import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import {baseURL} from '../../shared/baseurl';
import {ProcessHttpmsgProvider} from '../process-httpmsg/process-httpmsg';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import {Leader} from '../../shared/leader';

/*
 Generated class for the LeaderProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class LeaderProvider {

  constructor(public http: Http, private processHttpmsgProvider: ProcessHttpmsgProvider) {
    console.log('Hello LeaderProvider Provider');
  }

  getLeaders(): Observable<Leader[]> {
    return this.http.get(baseURL + 'leaders')
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getLeader(id: number): Observable<Leader> {
    return this.http.get(baseURL + 'leaders' + id)
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get(baseURL + 'leaders?featured=true')
      .map(res => {return this.processHttpmsgProvider.extractData(res)[0]})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }
}
