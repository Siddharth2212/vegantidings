import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {DishProvider} from "../dish/dish";
import {Observable} from "rxjs/Observable";
import {Dish} from "../../shared/dish";
import {ProcessHttpmsgProvider} from "../process-httpmsg/process-httpmsg";

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FavoriteProvider {
  favorites: Array<any>;

  constructor(public http: Http, private dishservice: DishProvider, private processHttpmsgProvider: ProcessHttpmsgProvider) {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
  }

  addFavorite(id: number) {
    return this.http.get('http://vegannews.herokuapp.com/updatefavorite?id='+id+'&userid=siddharthsogani22@gmail.com')
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  isFavorite(id: number): boolean{
    return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<any> {
    return this.http.get('http://vegannews.herokuapp.com/sampledata?userid=siddharthsogani22@gmail.com')
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

  deleteFavorite(id: number) : Observable<any> {
    return this.http.get('http://vegannews.herokuapp.com/updatefavorite2?id='+id+'&userid=siddharthsogani22@gmail.com')
      .map(res => {return this.processHttpmsgProvider.extractData(res)})
      .catch(error => {return this.processHttpmsgProvider.handleError(error)});
  }

}
