import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, ComponentRef, OnInit, OnDestroy } from '@angular/core';

import { ListDirective } from '../../directives/list.directive';
import { ListItem } from '../../models/ListItem';
import { ListComponent } from '../../components/list/list.component';
import { ListService } from '../../shared/list.service';
import { IStack } from '../../models/Stack';
import { StackService } from '../../shared/stack.service';

@Component({
  selector: 'database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit, AfterViewInit, OnDestroy {
  lists: ListItem[];
  listItem: ListItem;
  componentRef: ComponentRef<ListComponent>;
  selectedListItem: number;
  @ViewChild(ListDirective) listHost: ListDirective;
  interval: any;
  count: number;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private listService: ListService,
    private stackService: StackService) { }

  ngOnInit() {
    this.lists = this.listService.getLists();
  }

  ngAfterViewInit() {
    this.loadComponent(1);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  onSelect(index): void {
    this.selectedListItem = index;
  }

  loadComponent(index) {
    let listItem = this.lists[index];
    this.listItem = listItem;

    this.onSelect(index);

    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(listItem.component);

    let viewContainerRef = this.listHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<ListComponent>componentRef.instance).data = listItem.data;

    this.componentRef = componentRef;

    this.count = (<ListComponent>componentRef.instance).count;
  }

  addItem() {
    this.componentRef.instance.add();
   }
}