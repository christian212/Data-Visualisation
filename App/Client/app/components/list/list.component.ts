import { EventEmitter } from '@angular/core';

export interface ListComponent {
  count: number;

  searchTerm: string;

  countUpdated: EventEmitter<any>;
  
  add();
  details(id: number);
  edit(id: number);
  delete(item: any);
}
