import { Injectable } from '@angular/core';

import { StackListComponent } from '../components/list/stack-list/stack-list.component';
import { ListComponent } from '../components/list/list.component';
import { List } from '../models/List';

@Injectable()
export class ListService {
  getLists() {
    return [
      new List(StackListComponent, { navName: "Systeme", newName: "Neues System" }),
      new List(StackListComponent, { navName: "Stacks", newName: "Neuer Stack" }),
      new List(StackListComponent, { navName: "Zellen", newName: "Neue Zelle" }),
      new List(StackListComponent, { navName: "Messungen", newName: "Neue Messung" }),
    ];
  }
}