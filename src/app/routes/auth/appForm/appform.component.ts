import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../core/animations';
import { FuseConfigService } from '../../../core/services/config.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector   : 'application-form',
    templateUrl: './appform.component.html',
    styleUrls  : ['./appform.component.scss'],
    animations : fuseAnimations
})
export class AppformComponent implements OnInit
{
    registerForm: FormGroup;
    registerFormErrors: any;

    hasApiKey = false;
    hasTestbedApiKey = false;
    noApiKey = false;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder
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
            companyName           : {},
            email          : {},
            contactPerson       : {},
            contactPhone: {},
            fastwayApiKey: {},
            whetherHaveKey: {},
            eApiKey: {},
            eApiPass: {},
            eApiAccountNum: {},
            eTApiKey: {},
            eTApiPass: {},
            eTApiAccountNum: {},
            eAccountNum: {},
            stores: {},
            others: {}
        };
    }

    ngOnInit()
    {
        this.registerForm = this.formBuilder.group({
            companyName           : ['', Validators.required],
            email          : ['', [Validators.required, Validators.email]],
            contactPerson       : ['', Validators.required],
            contactPhone: ['', [Validators.required]],
            fastwayApiKey: ['', [Validators.required]],
            whetherHaveKey: ['', [Validators.required]],
            eApiKey: [''],
            eApiPass: [''],
            eApiAccountNum: [''],
            eTApiKey: [''],
            eTApiPass: [''],
            eTApiAccountNum: [''],
            eAccountNum: [''],
            stores: [''],
            others: ['']
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

    onChange(val) {
        if (val === '1') {
            this.hasApiKey = true;
            this.hasTestbedApiKey = false;
            this.noApiKey = false;
        } else if (val === '2') {
            this.hasApiKey = false;
            this.hasTestbedApiKey = true;
            this.noApiKey = false;
        } else if (val === '3') {
            this.hasApiKey = false;
            this.hasTestbedApiKey = false;
            this.noApiKey = true;
        } else {
            this.hasApiKey = false;
            this.hasTestbedApiKey = false;
            this.noApiKey = false;
        }
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
