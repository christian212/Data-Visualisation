import { Injectable } from '@angular/core';

import { StacksComponent } from '../components/stacks/stacks.component';
import { NotFoundComponent } from '../containers/not-found/not-found.component';
import { ListItem } from '../models/ListItem';

@Injectable()
export class ListService {
  getLists() {
    return [
      new ListItem(NotFoundComponent, {}),
      new ListItem(StacksComponent, {}),
      new ListItem(NotFoundComponent, {}),
      new ListItem(NotFoundComponent, {}),
    ];
  }
}