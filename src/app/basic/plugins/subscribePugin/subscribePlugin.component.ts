import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
// import { PluginService } from '../plugin.service';
import { Subscription } from 'rxjs/Subscription';
import { FusePerfectScrollbarDirective } from '../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { fuseAnimations } from '../../../core/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { PluginService } from '../plugin.service';

@Component({
    selector     : 'fuse-academy-course',
    templateUrl  : './subscribePlugin.component.html',
    styleUrls    : ['./subscribePlugin.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SubscribePluginComponent implements OnInit, OnDestroy, AfterViewInit
{

    constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private pluginService: PluginService,
    )
    {
      pluginService.loadByName(activatedRoute.snapshot.firstChild.url[0].path);
    }

    ngOnInit()
    {
        // Subscribe to courses
        // this.courseSubscription =
        //     this.courseService.onCourseChanged
        //         .subscribe(course => {
        //             this.course = course;
        //         });
    }

    ngAfterViewInit()
    {

    }

    ngOnDestroy(): void {

    }

    componentAdded(event){
      console.log(event);
    }
}
