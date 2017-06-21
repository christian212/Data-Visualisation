import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { ListDirective } from '../../directives/list.directive';
import { ListItem } from '../../models/ListItem';
import { ListComponent } from './list.component';

@Component({
  selector: 'list-banner',
  template: `
                <button type="button" class="btn btn-secondary" (click)="loadComponent(0)">0</button>
                <button type="button" class="btn btn-secondary" (click)="loadComponent(1)">1</button>
                <button type="button" class="btn btn-secondary" (click)="loadComponent(2)">2</button>
                <button type="button" class="btn btn-secondary" (click)="loadComponent(3)">Stacks</button>
                <ng-template list-host></ng-template>
            `
})
export class ListBannerComponent implements AfterViewInit, OnDestroy {
  @Input() lists: ListItem[];
  @ViewChild(ListDirective) listHost: ListDirective;
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
    let listItem = this.lists[index];

    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(listItem.component);

    let viewContainerRef = this.listHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<ListComponent>componentRef.instance).data = listItem.data;
  }
}