import { Injectable } from '@angular/core';

import { StackListComponent } from '../components/lists/stack-list/stack-list.component';
import { ListComponent } from '../components/lists/list.component';
import { List } from '../models/List';

@Injectable()
export class ListService {
  getLists() {
    return [
      new List(StackListComponent, {navName: "Systeme"}),
      new List(StackListComponent, {navName: "Stacks"}),
      new List(StackListComponent, {navName: "Zellen"}),
      new List(StackListComponent, {navName: "Messungen"}),
    ];
  }
}