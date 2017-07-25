import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavBarComponent {
  show: boolean = false;

  constructor(private _eref: ElementRef) { }

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
