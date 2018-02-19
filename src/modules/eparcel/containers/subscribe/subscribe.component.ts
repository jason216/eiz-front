import { Router } from '@angular/router';
import { ApiService } from './../../../../app/alpha/services/api.service';
import { PluginService } from './../../../../app/basic/plugins/plugin.service';
import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fastway-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})


export class SubscribeComponent implements OnInit, OnDestroy {
  apiKeyFormGroup: FormGroup;
  isLinear = true;
  requirementCheck = false;
  shippingMethodsFormGroup: FormGroup;
  shippingMethodsPriceFormGroup: FormGroup;
  onPluginLoaded: Subscription;
  userID: string;

  shippingMethods: [any];

  generalSettings: any;

  selectedOptions = new Array();


  constructor(
    private _formBuilder: FormBuilder,
    private pluginService: PluginService,
    private apiService: ApiService,
    private router: Router,
  ) {
  }
  ngOnInit() {
    this.apiKeyFormGroup = this._formBuilder.group({
      apiKey: ['', Validators.required],
      apiPass: ['', Validators.required],
      apiAccount: ['', Validators.required]
    });
    this.shippingMethodsFormGroup = this._formBuilder.group({
      shippingMethodsSelected: ['', Validators.required]
    });
    this.shippingMethodsPriceFormGroup = this._formBuilder.group({
      price: ['', Validators.required]
    });

    this.onPluginLoaded = this.pluginService.onPluginLoaded.subscribe(
      (res) => {
        this.apiService.get('account', 'shippingMethods', res.id).subscribe(
          (shippingMethod_res) => {
            this.shippingMethods = shippingMethod_res.data;
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.onPluginLoaded.unsubscribe();
  }

  validateApiToken(){
    this.apiService.get('publicPlugin', 'eParcel', 'validate', {
      'apiKey': this.apiKeyFormGroup.get('apiKey').value,
      'password': this.apiKeyFormGroup.get('apiPass').value,
      'account': this.apiKeyFormGroup.get('apiAccount').value
    }).subscribe(
      (res) => {
        this.generalSettings = res.data;
        this.generalSettings.apiKey = this.apiKeyFormGroup.get('apiKey').value;
        this.generalSettings.apiPass = this.apiKeyFormGroup.get('apiPass').value;
        this.generalSettings.apiAccount = this.apiKeyFormGroup.get('apiAccount').value;
        res.data.postage_products.forEach(postage_product => {
          this.shippingMethods.forEach(shippingMethod => {
            if (shippingMethod.indexName === postage_product.type){
              shippingMethod.subscribed = true;
              shippingMethod.accountSettings = postage_product;
              this.selectedOptions.push(shippingMethod);
            }
          });
        });
        console.log(this.selectedOptions);
      }
    );
  }

  test(){
    console.log(this.selectedOptions);
  }

  submitSubscribe(){
    this.selectedOptions.forEach(element => {
      element.subscribed = true;
    });

    // console.log({
    //   'general': {apiKey: this.apiKeyFormGroup.get('apiKey').value},
    //   'shippingMethods': this.selectedOptions
    // });

    this.pluginService.subscribePlugin().subscribe(
      (res) => {
        this.apiService.put('Fastway', 'settings', null, {
          'general': this.generalSettings,
          'shippingMethods': this.selectedOptions
        }).subscribe(
          (settings_res) => {
            this.router.navigate(['/plugins']);
          }
        );
      }
    );
  }
}
