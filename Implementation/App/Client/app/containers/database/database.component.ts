import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';

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
  selectedListItem: number;
  stacks: IStack[];
  @ViewChild(ListDirective) listHost: ListDirective;
  subscription: any;
  interval: any;

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
    this.onSelect(index);
    let listItem = this.lists[index];

    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(listItem.component);

    let viewContainerRef = this.listHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<ListComponent>componentRef.instance).data = listItem.data;
  }

  addStack() {
    let newStackName: any = "Neuer Stack";
    this.stackService.addStack(newStackName).subscribe(result => {
      console.log('Post user result: ', result);
      if (result.ok) {
        this.stacks.push(result.json());
      }
    }, error => {
      console.log(`There was an issue. ${error._body}.`);
    });

    // Provisorisch
    this.loadComponent(this.selectedListItem);
  }
}