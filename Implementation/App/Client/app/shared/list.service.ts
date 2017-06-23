import { Injectable } from '@angular/core';

import { StackListComponent } from '../components/stacks/stack-list/stack-list.component';
import { NotFoundComponent } from '../containers/not-found/not-found.component';
import { ListItem } from '../models/ListItem';

@Injectable()
export class ListService {
  getLists() {
    return [
      new ListItem(NotFoundComponent, {}),
      new ListItem(StackListComponent, {}),
      new ListItem(NotFoundComponent, {}),
      new ListItem(NotFoundComponent, {}),
    ];
  }
}