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

  selectedOptions;

  locations = [
    {value: 'ADL', viewValue: 'Adelaide'},
    {value: 'ALB', viewValue: 'Albury'},
    {value: 'BEN', viewValue: 'Bendigo'},
    {value: 'BRI', viewValue: 'Brisbane'},
    {value: 'CNS', viewValue: 'Cairns'},
    {value: 'CBR', viewValue: 'Canberra'},
    {value: 'CAP', viewValue: 'Capricorn Coast'},
    {value: 'CCT', viewValue: 'Central Coast'},
    {value: 'CFS', viewValue: 'Coffs Harbour'},
    {value: 'GEE', viewValue: 'Geelong'},
    {value: 'GLD', viewValue: 'Gold Coast'},
    {value: 'TAS', viewValue: 'Hobart'},
    {value: 'LAU', viewValue: 'Launceston'},
    {value: 'MKY', viewValue: 'Mackay'},
    {value: 'MEL', viewValue: 'Melbourne'},
    {value: 'NEW', viewValue: 'Newcastle'},
    {value: 'NTH', viewValue: 'Northern Rivers'},
    {value: 'OAG', viewValue: 'Orange'},
    {value: 'PER', viewValue: 'Perth'},
    {value: 'PQQ', viewValue: 'Port Macquarie'},
    {value: 'SUN', viewValue: 'Sunshine Coast'},
    {value: 'SYD', viewValue: 'Sydney'},
    {value: 'TMW', viewValue: 'Tamworth'},
    {value: 'TOO', viewValue: 'Toowoomba'},
    {value: 'TVL', viewValue: 'Townsville'},
    {value: 'BDB', viewValue: 'Wide Bay'},
    {value: 'WOL', viewValue: 'WOL'},
  ];


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
      location: ['', Validators.required]
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
    this.apiService.get('publicPlugin', 'Fastway', 'validate', {'apiKey': this.apiKeyFormGroup.get('apiKey').value}).subscribe(
      (res) => {
        this.generalSettings = res.data;
        this.generalSettings.apiKey = this.apiKeyFormGroup.get('apiKey').value;
        this.generalSettings.location = this.apiKeyFormGroup.get('location').value;
      }
    );
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
