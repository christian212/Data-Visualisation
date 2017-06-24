import { Type } from '@angular/core';

import { ListComponent } from '../components/list/list.component';

export class ListItem {
  constructor(
    public component: Type<any>,
    public data: any)
  { }
}