import {Component, Inject, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LeaderProvider} from "../../providers/leader/leader";
import {Leader} from "../../shared/leader";

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit{
  leaders: Leader[];
  leaderErrMsg: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private leaderservice: LeaderProvider, @Inject('BaseURL') private BaseURL) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  ngOnInit(){
    this.leaderservice.getLeaders()
      .subscribe(leaders =>  this.leaders = leaders, errmess => this.leaderErrMsg = <any>errmess);
  }

}
