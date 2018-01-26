import { MenuService } from './alpha/services/menu.service';
import { Component } from '@angular/core';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from './core/services/translation-loader.service';

import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { FuseNavigationModel } from './navigation/navigation.model';
import { AuthService } from './alpha/services/auth.service';
import { User } from './alpha/models/user.model';
import { locale as navigationEnglish } from './navigation/i18n/en';
import { locale as navigationTurkish } from './navigation/i18n/tr';

@Component({
    selector   : 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{

    constructor(
        private menuService: MenuService,
        private fuseNavigationService: FuseNavigationService,
        private fuseSplashScreen: FuseSplashScreenService,
        private translate: TranslateService,
        private translationLoader: FuseTranslationLoaderService,
        private auth: AuthService,
    )
    {
        // Add languages
        this.translate.addLangs(['en', 'tr']);

        // Set the default language
        this.translate.setDefaultLang('en');

        // Use a language
        this.translate.use('en');

        this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
        this.menuService.loadFromRemote();
        // Set the navigation model

        // Inistial Auth information
        this.auth.user = new User();


        // Set the navigation translations
        this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);
    }


}
