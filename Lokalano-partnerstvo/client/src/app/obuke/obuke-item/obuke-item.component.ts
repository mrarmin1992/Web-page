import { Component, Input, OnInit } from '@angular/core';
import { Obuka } from 'src/app/shared/models/obuka';

@Component({
  selector: 'app-obuke-item',
  templateUrl: './obuke-item.component.html',
  styleUrls: ['./obuke-item.component.scss']
})
export class ObukeItemComponent implements OnInit {
  @Input() obuka: Obuka;
  constructor() { }

  ngOnInit(): void {
  }

}
