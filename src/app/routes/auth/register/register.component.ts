import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { fuseAnimations } from '../../../core/animations';
import { FuseConfigService } from '../../../core/services/config.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations : fuseAnimations,
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registerFormErrors: any;

  constructor(
      private fuseConfig: FuseConfigService,
      private formBuilder: FormBuilder,
      private http: HttpClient
  )
  {
      this.fuseConfig.setSettings({
          layout: {
              navigation: 'none',
              toolbar   : 'none',
              footer    : 'none'
          }
      });

      this.registerFormErrors = {
          username       : {},
          email          : {},
          password       : {},
          passwordConfirm: {}
      };
  }

  ngOnInit()
  {
      this.registerForm = this.formBuilder.group({
          username       : ['', Validators.required],
          email          : ['', [Validators.required, Validators.email]],
          password       : ['', Validators.required],
          passwordConfirm: ['', [Validators.required, confirmPassword]]
      });

      this.registerForm.valueChanges.subscribe(() => {
          this.onRegisterFormValuesChanged();
      });
  }

  onRegisterFormValuesChanged()
  {
      for ( const field in this.registerFormErrors )
      {
          if ( !this.registerFormErrors.hasOwnProperty(field) )
          {
              continue;
          }

          // Clear previous errors
          this.registerFormErrors[field] = {};

          // Get the control
          const control = this.registerForm.get(field);

          if ( control && control.dirty && !control.valid )
          {
              this.registerFormErrors[field] = control.errors;
          }
      }
  }

  register(){
    this.http.post('http://app.eiz.com.au/register', this.registerForm.value, {}).subscribe(data => {
        // Read the result field from the JSON response.
        console.log(data);
    });
  }
}

function confirmPassword(control: AbstractControl)
{
  if ( !control.parent || !control )
  {
      return;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if ( !password || !passwordConfirm )
  {
      return;
  }

  if ( passwordConfirm.value === '' )
  {
      return;
  }

  if ( password.value !== passwordConfirm.value )
  {
      return {
          passwordsNotMatch: true
      };
  }
}


