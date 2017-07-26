import { Injectable } from '@angular/core';

import { BatteryListComponent } from '../components/list/battery-list/battery-list.component';
import { StackListComponent } from '../components/list/stack-list/stack-list.component';
import { CellListComponent } from '../components/list/cell-list/cell-list.component';
import { MeasurementListComponent } from '../components/list/measurement-list/measurement-list.component';
import { ListComponent } from '../components/list/list.component';
import { List } from '../models/List';

@Injectable()
export class ListService {
  getLists() {
    return [
      new List(BatteryListComponent, { navName: 'Systeme', newName: 'Neues System' }),
      new List(StackListComponent, { navName: 'Stacks', newName: 'Neuer Stack' }),
      new List(CellListComponent, { navName: 'Zellen', newName: 'Neue Zelle' }),
      new List(MeasurementListComponent, { navName: 'Messungen', newName: 'Neue Messung' }),
    ];
  }
}
