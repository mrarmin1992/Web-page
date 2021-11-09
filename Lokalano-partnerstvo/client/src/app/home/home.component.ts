import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#fff';
  hoverColor = '#555';

  constructor() {
    this.changeTheme(this.color, this.hoverColor);
  }

  ngOnInit(): void {

  }
  changeTheme(primary: string, secondary: string) {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
}
