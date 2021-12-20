import { Component, Input, OnInit } from '@angular/core';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  version = "1.0.0";
  @Input() name: string = 'Karan Dhawan';
  faLinkedin = faLinkedin;

  constructor() { }

  ngOnInit(): void {
  }
}
