import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavBarComponent implements OnInit, OnDestroy {

  status: boolean;
  subscription: Subscription;
  show: boolean = false;

  constructor(private _eref: ElementRef,
    private userService: UserService) {
  }

  logout() {
    this.userService.logout();
  }

  ngOnInit() {
    this.subscription = this.userService.authNavStatus$.subscribe(status => this.status = status);
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target))
      this.show = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.show = false;
  }

  toggleCollapse() {
    this.show = !this.show;
  }
}
