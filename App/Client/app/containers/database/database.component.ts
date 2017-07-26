import { Component, Input, ViewChild, ComponentFactoryResolver, ComponentRef, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChange } from '@angular/core';

import { List } from '../../models/List';
import { ListDirective } from '../../directives/list.directive';
import { ListComponent } from '../../components/list/list.component';
import { ListService } from '../../services/list.service';
import { Stack } from '../../models/Stack';
import { BatteryService } from '../../services/battery.service';
import { StackService } from '../../services/stack.service';
import { CellService } from '../../services/cell.service';
import { MeasurementService } from '../../services/measurement.service';

@Component({
  selector: 'database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})

export class DatabaseComponent implements OnInit, AfterViewInit, OnDestroy {
  lists: List[];
  selectedList: List;
  selectedListComponentRef: ListComponent;
  selectedListIndex: number;
  counts: number[] = [0, 0, 0, 0];
  searchTerm: string;

  @ViewChild(ListDirective) listHost: ListDirective;
  interval: any;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private listService: ListService,
    private batteryService: BatteryService,
    private stackService: StackService,
    private cellService: CellService,
    private measurementService: MeasurementService) { }

  ngOnInit() {
    this.lists = this.listService.getLists();
    this.selectedList = this.lists[0];
    this.selectedListIndex = 1;

    this.getCounts();
  }

  ngAfterViewInit() {
    this.loadComponent(1);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  getCounts() {
    this.batteryService.getBatteryCount().subscribe(result => {
      console.log('Get stack count result: ', result);
      console.log('TransferHttp [GET] /api/stacks/allresult', result);
      this.counts[0] = result;
    });

    this.stackService.getStackCount().subscribe(result => {
      console.log('Get stack count result: ', result);
      console.log('TransferHttp [GET] /api/stacks/allresult', result);
      this.counts[1] = result;
    });

    this.cellService.getCellCount().subscribe(result => {
      console.log('Get stack count result: ', result);
      console.log('TransferHttp [GET] /api/stacks/allresult', result);
      this.counts[2] = result;
    });

    this.measurementService.getMeasurementCount().subscribe(result => {
      console.log('Get stack count result: ', result);
      console.log('TransferHttp [GET] /api/stacks/allresult', result);
      this.counts[3] = result;
    });
  }

  loadComponent(index) {
    let list = this.lists[index];
    this.selectedList = list;
    this.selectedListIndex = index;

    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(list.component);

    let viewContainerRef = this.listHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);

    this.selectedListComponentRef = (<ListComponent>componentRef.instance);

    this.selectedListComponentRef.searchTerm = this.searchTerm;
    this.selectedListComponentRef.countUpdated.subscribe(count => this.counts[this.selectedListIndex] = count);
  }

  onSearchChange() {
    this.selectedListComponentRef.searchTerm = this.searchTerm;
  }

  addItem() {
    this.selectedListComponentRef.add();
  }
}
