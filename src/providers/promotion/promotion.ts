import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import {baseURL} from '../../shared/baseurl';
import {ProcessHttpmsgProvider} from '../process-httpmsg/process-httpmsg';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import {Promotion} from '../../shared/promotion';

/*
 Generated class for the PromotionProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class PromotionProvider {

  constructor(public http: Http, private processHttpmsgProvider: ProcessHttpmsgProvider) {
    console.log('Hello PromotionProvider Provider');
  }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get('http://vegannews.herokuapp.com/getapproveddata')
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getPromotionsCategory(category: number): Observable<Promotion[]> {
    return this.http.get('http://vegannews.herokuapp.com/getapproveddata?category='+category)
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getPromotionsQuerySearch(category: number): Observable<Promotion[]> {
    return this.http.get('http://vegannews.herokuapp.com/getapproveddata?searchString='+category)
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get(baseURL + 'promotions' + id)
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get(baseURL + 'promotions?featured=true')
      .map(res => {return this.processHttpmsgProvider.extractData(res)[0]})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }
}
