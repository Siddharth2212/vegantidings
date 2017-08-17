import {Component, Inject, OnInit} from '@angular/core';
import {IonicPage, ItemSliding, NavController, NavParams} from 'ionic-angular';
import {Dish} from "../../shared/dish";
import {FavoriteProvider} from "../../providers/favorite/favorite";

/**
 * Generated class for the FavoritesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage implements OnInit{
  favorites: Dish[];
  errmsg: string;

  constructor(public navCtrl: NavController,
              private favoriteservice: FavoriteProvider,
              @Inject('BaseURL') private BaseURL,
              public navParams: NavParams) {
  }

  ngOnInit() {
    this.favoriteservice.getFavorites()
      .subscribe(favorites => this.favorites = favorites, error => this.errmsg = error);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  deleteFavorite(item: ItemSliding, id: number) {
    this.favoriteservice.deleteFavorite(id)
      .subscribe(favorites => this.favorites = favorites, err => this.errmsg = err);
    item.close();
  }

}
