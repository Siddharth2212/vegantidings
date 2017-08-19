import { Component, OnInit, Inject } from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from 'ionic-angular';
import {Dish} from '../../shared/dish';
import {DishProvider} from '../../providers/dish/dish';
import {Promotion} from '../../shared/promotion';
import {PromotionProvider} from '../../providers/promotion/promotion';
import {Leader} from '../../shared/leader';
import {LeaderProvider} from '../../providers/leader/leader';
import {FavoriteProvider} from "../../providers/favorite/favorite";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMsg: String;
  promoErrMsg: String;
  leaderErrMsg: String;
  newsfeedsErrMsg: String;
  BaseURL: String;
  newsfeeds: Array<any>;
  newscategory;

  constructor(public navCtrl: NavController,
  private dishservice: DishProvider,
  private alertCtrl: AlertController,
  private loadingCtrl: LoadingController,
  private toastCtrl: ToastController,
  private promotionservice: PromotionProvider,
  private favoriteservice: FavoriteProvider,
  private leaderservice: LeaderProvider,
  @Inject('BaseURL') private BaseURL2) {
    this.newscategory = "home";
  }

  getHostName(url) {
    var urlParts = url.split('url=');
    var match = urlParts[1].match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return match[2];
    }
    else {
      return null;
    }
  }

  ngOnInit(){
    this.BaseURL = this.BaseURL2;
    this.dishservice.getFeaturedDish()
      .subscribe(dish =>  {this.dish = dish; console.log('____'); console.log(dish);}, errmess => this.dishErrMsg = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
      .subscribe(promotion =>  this.promotion = promotion, errmess => this.leaderErrMsg = <any>errmess);
    this.leaderservice.getFeaturedLeader()
      .subscribe(leader =>  this.leader = leader, errmess => this.promoErrMsg = <any>errmess);
    this.promotionservice.getPromotions()
      .subscribe(newsfeeds =>  {this.newsfeeds = newsfeeds; console.log(this.newsfeeds);}, errmess => this.newsfeedsErrMsg = <any>errmess);
  }

  deleteFavorite(id: number, index) {
    if(index !==-1){
      console.log('delete', id);

      let alert = this.alertCtrl.create({
        title: 'Confirm Unsave',
        message: 'Do you want to unsave news?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Unsave cancelled');
            }
          },
          {
            text: 'Delete',
            handler: () => {
              let loading = this.loadingCtrl.create({
                content: 'Deleting . . .'
              });
              let toast = this.toastCtrl.create({
                message: 'News unsaved successfully',
                duration: 3000});
              loading.present();
              this.favoriteservice.deleteFavorite(id)
                .subscribe(favorites => {loading.dismiss(); toast.present(); } ,
                  errmess =>{ this.newsfeedsErrMsg = errmess; loading.dismiss(); });
            }
          }
        ]
      });

      alert.present();
    }
    else{
      let loading = this.loadingCtrl.create({
        content: 'Saving . . .'
      });
      let toast = this.toastCtrl.create({
        message: 'News saved successfully',
        duration: 3000});
      loading.present();
      this.favoriteservice.addFavorite(id)
        .subscribe(favorites => {
          loading.dismiss(); toast.present();
          for(var i = 0; i < this.newsfeeds.length; i++){
            if(this.newsfeeds[i]['_id'] == id){
              this.newsfeeds[i]['favorites'].push('siddharthsogani22@gmail.com');
            }
          }
          } ,
          errmess =>{ this.newsfeedsErrMsg = errmess; loading.dismiss(); });
    }
  }

  onSegmentChanged(category){
    let loading = this.loadingCtrl.create({
      content: 'Loading . . .'
    });
    loading.present();
    if(category.value == 'home'){
      let toast = this.toastCtrl.create({
        message: 'Showing data for Home category',
        duration: 3000});
      this.promotionservice.getPromotions()
        .subscribe(newsfeeds =>  {this.newsfeeds = newsfeeds; console.log(this.newsfeeds); loading.dismiss(); toast.present();}, errmess => this.newsfeedsErrMsg = <any>errmess);
    }
    else{
      var categories = ['Home', 'SEO', 'SEM', 'Analytics', 'Content Marketing', 'Mobile',
        'Social Media Marketing', 'Google AdWords', 'Facebook'];
      let toast = this.toastCtrl.create({
        message: 'Showing data for '+categories[category.value]+' category',
        duration: 3000});
      this.promotionservice.getPromotionsCategory(category.value)
        .subscribe(newsfeeds =>  {console.log('___');console.log(this.newsfeeds); this.newsfeeds = newsfeeds; console.log(this.newsfeeds); loading.dismiss(); toast.present();}, errmess => this.newsfeedsErrMsg = <any>errmess);
    }
  }

  getItems(event){
    let loading = this.loadingCtrl.create({
      content: 'Loading . . .'
    });
    loading.present();
    this.promotionservice.getPromotionsQuerySearch(event.target.value)
      .subscribe(newsfeeds =>  {this.newsfeeds = newsfeeds;
      let toast;
      if(this.newsfeeds.length == 0){
        toast = this.toastCtrl.create({
          message: 'No data found for your query',
          duration: 3000});
      }
      else{
        toast = this.toastCtrl.create({
          message: 'Showing data for search query',
          duration: 3000});
      }
      console.log(this.newsfeeds);
      loading.dismiss(); toast.present();}, errmess => this.newsfeedsErrMsg = <any>errmess);
  }
}
