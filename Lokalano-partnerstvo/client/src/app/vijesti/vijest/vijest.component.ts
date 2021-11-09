import { Component, Input, OnInit } from '@angular/core';
import { Vijest } from 'src/app/shared/models/vijest';

@Component({
  selector: 'app-vijest',
  templateUrl: './vijest.component.html',
  styleUrls: ['./vijest.component.scss']
})
export class VijestComponent implements OnInit {
  @Input() vijest: Vijest;
  constructor() { }

  ngOnInit(): void {
  }

}
