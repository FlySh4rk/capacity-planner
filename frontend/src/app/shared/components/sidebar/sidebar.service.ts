import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _sidebarState = new BehaviorSubject<boolean>(true);
  public sidebarState = this._sidebarState.asObservable();

  constructor() {}

  toggle(): void {
    this._sidebarState.next(!this._sidebarState.value);
  }
}
