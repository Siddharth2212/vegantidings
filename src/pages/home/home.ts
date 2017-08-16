import { Component, OnInit, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Dish} from '../../shared/dish';
import {DishProvider} from '../../providers/dish/dish';
import {Promotion} from '../../shared/promotion';
import {PromotionProvider} from '../../providers/promotion/promotion';
import {Leader} from '../../shared/leader';
import {LeaderProvider} from '../../providers/leader/leader';

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
  BaseURL: String;

  constructor(public navCtrl: NavController,
  private dishservice: DishProvider,
  private promotionservice: PromotionProvider,
  private leaderservice: LeaderProvider,
  @Inject('BaseURL') private BaseURL2) {

  }

  ngOnInit(){
    this.BaseURL = this.BaseURL2;
    this.dishservice.getFeaturedDish()
      .subscribe(dish =>  {this.dish = dish; console.log('____'); console.log(dish);}, errmess => this.dishErrMsg = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
      .subscribe(promotion =>  this.promotion = promotion, errmess => this.leaderErrMsg = <any>errmess);
    this.leaderservice.getFeaturedLeader()
      .subscribe(leader =>  this.leader = leader, errmess => this.promoErrMsg = <any>errmess);
  }

}
