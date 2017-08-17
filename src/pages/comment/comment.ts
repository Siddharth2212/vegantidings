import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CommentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  feedback: FormGroup;

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              private viewCtrl: ViewController,
              public navParams: NavParams) {
    this.feedback = this.formBuilder.group({
        author: '',
        rating: 5,
        comment: ''
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

  onSubmit() {
    let comment = this.feedback.value;
    comment.date = (new Date()).toISOString();
    this.viewCtrl.dismiss(comment);
  }

}
