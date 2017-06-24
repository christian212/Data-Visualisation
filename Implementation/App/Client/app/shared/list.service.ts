import { Injectable } from '@angular/core';

import { StackListComponent } from '../components/stacks/stack-list/stack-list.component';
import { ListComponent } from '../components/list/list.component';
import { NotFoundComponent } from '../containers/not-found/not-found.component';
import { ListItem } from '../models/ListItem';

@Injectable()
export class ListService {
  getLists() {
    return [
      new ListItem(StackListComponent, {}),
      new ListItem(StackListComponent, {}),
      new ListItem(StackListComponent, {}),
      new ListItem(StackListComponent, {}),
    ];
  }
}