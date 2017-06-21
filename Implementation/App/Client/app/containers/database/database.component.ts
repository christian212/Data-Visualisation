import { Component, OnInit } from '@angular/core';

import { AdService } from '../../shared/ad.service';
import { AdItem } from '../../components/ad/ad-item';

@Component({
  selector: 'database',
  templateUrl: './database.component.html'
})
export class DatabaseComponent implements OnInit {
  ads: AdItem[];

  constructor(private adService: AdService) {}

  ngOnInit() {
    this.ads = this.adService.getAds();
  }
}