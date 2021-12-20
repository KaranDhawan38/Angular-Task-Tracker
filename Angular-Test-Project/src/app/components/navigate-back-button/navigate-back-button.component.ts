import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigate-back-button',
  templateUrl: './navigate-back-button.component.html',
  styleUrls: ['./navigate-back-button.component.css']
})
export class NavigateBackButtonComponent implements OnInit {
  faArrowLeft = faArrowLeft;

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  backClicked() {
    this._location.back();
  }
}
