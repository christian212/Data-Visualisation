import { Type } from '@angular/core';

import { ListComponent } from '../components/list/list.component';

export class List {
  constructor(
    public component: Type<ListComponent>,
    public data: any)
  { }
}