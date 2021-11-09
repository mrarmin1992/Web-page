import { Component, Input, OnInit } from '@angular/core';
import { Dogadjaj } from 'src/app/shared/models/dogadjaj';

@Component({
  selector: 'app-dogadjaj',
  templateUrl: './dogadjaj.component.html',
  styleUrls: ['./dogadjaj.component.scss']
})
export class DogadjajComponent implements OnInit {
  @Input() dogadjaj: Dogadjaj;

  constructor() { }

  ngOnInit(): void {
  }

}
