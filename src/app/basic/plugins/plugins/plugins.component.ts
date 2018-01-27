import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PluginsService } from '../plugins.service';

@Component({
    selector   : 'fuse-academy-plugins',
    templateUrl: './plugins.component.html',
    styleUrls  : ['./plugins.component.scss']
})
export class PluginsComponent implements OnInit, OnDestroy
{
    categories: any[];
    plugins: any[];
    pluginsFilteredByCategory: any[];
    filteredplugins: any[];

    categoriesSubscription: Subscription;
    pluginsSubscription: Subscription;

    currentCategory = 'all';
    searchTerm = '';

    constructor(
        private pluginsService: PluginsService
    )
    {

    }

    ngOnInit()
    {
        // Subscribe to categories
        // this.categoriesSubscription =
        //     this.pluginsService.onCategoriesChanged
        //         .subscribe(categories => {
        //             this.categories = categories;
        //         });

        // Subscribe to plugins
        this.pluginsSubscription =
            this.pluginsService.onPluginsChanged
                .subscribe(res => {
                    this.filteredplugins = this.pluginsFilteredByCategory = this.plugins = res;
                });
    }

    ngOnDestroy()
    {
        // this.categoriesSubscription.unsubscribe();
        this.pluginsSubscription.unsubscribe();
    }

    filterpluginsByCategory()
    {
      console.log('filterpluginsByCategory');
        // Filter
        if ( this.currentCategory === 'all' )
        {
            this.pluginsFilteredByCategory = this.plugins;
            this.filteredplugins = this.plugins;
        }
        else
        {
            this.pluginsFilteredByCategory = this.plugins.filter((course) => {
                return course.category === this.currentCategory;
            });

            this.filteredplugins = [...this.pluginsFilteredByCategory];

        }

        // Re-filter by search term
        this.filterpluginsByTerm();
    }

    filterpluginsByTerm()
    {
      console.log('filterpluginsByTerm');
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if ( searchTerm === '' )
        {
            this.filteredplugins = this.pluginsFilteredByCategory;
        }
        else
        {
            this.filteredplugins = this.pluginsFilteredByCategory.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }
}
