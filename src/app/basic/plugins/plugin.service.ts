import { ApiService } from './../../alpha/services/api.service';
import { Injectable, Output } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PluginService{
    plugin;
    onPluginLoaded: BehaviorSubject<any> = new BehaviorSubject({});
    constructor(private apiService: ApiService)
    {

    }

    loadByName(name: string){
      console.log(name);
      this.apiService.get('account', 'allPlugins', name).subscribe(
        (res) => {
          this.plugin = res.data;
          this.onPluginLoaded.next(this.plugin);
        }
      );
    }

    subscribePlugin(){
      return this.apiService.put('account', 'subscribePlugin', this.plugin['id']).map(
        (res) => {
          console.log(res);
        }
      );
    }
}
