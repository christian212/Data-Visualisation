import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { AdDirective } from '../../directives/ad.directive';
import { AdItem } from './ad-item';
import { AdComponent } from './ad.component';

@Component({
  selector: 'add-banner',
  template: `
              <div class="ad-banner">
                <h3>Advertisements</h3>
                <button type="button" class="btn btn-secondary" (click)="loadComponent(0)">0</button>
                <button type="button" class="btn btn-secondary" (click)="loadComponent(1)">1</button>
                <button type="button" class="btn btn-secondary" (click)="loadComponent(2)">2</button>
                <button type="button" class="btn btn-secondary" (click)="loadComponent(3)">Stacks</button>
                <ng-template ad-host></ng-template>
              </div>
            `
})
export class AdBannerComponent implements AfterViewInit, OnDestroy {
  @Input() ads: AdItem[];
  currentAddIndex: number = -1;
  @ViewChild(AdDirective) adHost: AdDirective;
  subscription: any;
  interval: any;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit() {
    this.loadComponent(0);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadComponent(index) {
    let adItem = this.ads[index];

    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(adItem.component);

    let viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<AdComponent>componentRef.instance).data = adItem.data;
  }
}
