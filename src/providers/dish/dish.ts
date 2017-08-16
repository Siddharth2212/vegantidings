import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import {baseURL} from '../../shared/baseurl';
import {ProcessHttpmsgProvider} from '../process-httpmsg/process-httpmsg';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import {Dish} from '../../shared/dish';

/*
  Generated class for the DishProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DishProvider {

  constructor(public http: Http, private processHttpmsgProvider: ProcessHttpmsgProvider) {
    console.log('Hello DishProvider Provider');
  }

  getDishes(): Observable<Dish[]> {
    return this.http.get(baseURL + 'dishes')
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get(baseURL + 'dishes' + id)
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get(baseURL + 'dishes?featured=true')
      .map(res => {return this.processHttpmsgProvider.extractData(res)[0]})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  getDishIds(): Observable<number[]> {
    return this.getDishes()
      .map(dishes => { return dishes.map(dish => dish.id); })
      .catch(error => { return error; } );
  }
}
