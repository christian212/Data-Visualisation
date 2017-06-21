import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';

import { ListDirective } from '../../directives/list.directive';
import { ListItem } from '../../models/ListItem';
import { ListComponent } from '../../components/list/list.component';
import { ListService } from '../../shared/list.service';

@Component({
  selector: 'database',
  templateUrl: './database.component.html'
})
export class DatabaseComponent implements OnInit, AfterViewInit, OnDestroy {
  lists: ListItem[];
  @ViewChild(ListDirective) listHost: ListDirective;
  subscription: any;
  interval: any;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver, private listService: ListService) { }

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

  ngOnInit() {
    this.lists = this.listService.getLists();
  }
}