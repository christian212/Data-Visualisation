import { Injectable }           from '@angular/core';

import { HeroJobAdComponent }   from '../components/ad/hero-job-ad.component';
import { HeroProfileComponent } from '../components/ad/hero-profile.component';
import { StacksComponent } from '../components/stacks/stacks.component';
import { ListItem }               from '../models/ListItem';

@Injectable()
export class ListService {
  getLists() {
    return [
      new ListItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'}),

      new ListItem(HeroProfileComponent, {name: 'Dr IQ', bio: 'Smart as they come'}),

      new ListItem(HeroJobAdComponent,   {headline: 'Hiring for several positions',
                                        body: 'Submit your resume today!'}),

      new ListItem(StacksComponent,   {}),                             
    ];
  }
}
