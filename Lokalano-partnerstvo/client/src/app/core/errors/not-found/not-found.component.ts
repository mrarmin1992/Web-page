import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';

  constructor() { }

  ngOnInit(): void {
    this.changeTheme(this.hoverColor, this.color);
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

}
