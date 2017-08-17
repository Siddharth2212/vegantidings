import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, Inject } from '@angular/core';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import {FavoriteProvider} from "../../providers/favorite/favorite";

/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  numcomments: number;
  avgstars: String;
  favorite: boolean = false;

  constructor(public navCtrl: NavController,
              private favoriteservice: FavoriteProvider,
              public navParams: NavParams,
              @Inject('BaseURL') private BaseURL) {
    this.dish = navParams.get('dish');
    this.numcomments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => total+= comment.rating);
    this.avgstars = (total/this.numcomments).toFixed(2);
    this.favorite = this.favoriteservice.isFavorite(this.dish.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
  }

}
