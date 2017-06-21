import { Component, OnInit } from '@angular/core';

import { ListService } from '../../shared/list.service';
import { ListItem } from '../../models/ListItem';

@Component({
  selector: 'database',
  templateUrl: './database.component.html'
})
export class DatabaseComponent implements OnInit {
  lists: ListItem[];

  constructor(private listService: ListService) {}

  ngOnInit() {
    this.lists = this.listService.getLists();
  }
}