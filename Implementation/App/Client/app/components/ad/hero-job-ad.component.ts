import { Component, Input } from '@angular/core';

import { ListComponent }      from '../list/list.component';

@Component({
  template: `
    <div class="job-ad">
      <h4>{{data.headline}}</h4> 
      
      {{data.body}}
    </div>
  `
})
export class HeroJobAdComponent implements ListComponent {
  @Input() data: any;

}