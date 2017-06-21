import { Injectable }           from '@angular/core';

import { HeroJobAdComponent }   from '../components/ad/hero-job-ad.component';
import { HeroProfileComponent } from '../components/ad/hero-profile.component';
import { StacksComponent } from '../components/stacks/stacks.component';
import { AdItem }               from '../components/ad/ad-item';

@Injectable()
export class AdService {
  getAds() {
    return [
      new AdItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'}),

      new AdItem(HeroProfileComponent, {name: 'Dr IQ', bio: 'Smart as they come'}),

      new AdItem(HeroJobAdComponent,   {headline: 'Hiring for several positions',
                                        body: 'Submit your resume today!'}),

      new AdItem(StacksComponent,   {}),                             
    ];
  }
}
