import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name: string = 'Karan Dhawan';
  appName: string = 'Task Tracker';

  constructor() { }
}

// export class Car {
//   carName: string = 'Audi';
// }