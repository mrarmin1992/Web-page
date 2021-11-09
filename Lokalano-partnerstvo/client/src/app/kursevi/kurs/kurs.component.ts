import { Component, Input, OnInit } from '@angular/core';
import { Kurs } from 'src/app/shared/models/kurs';

@Component({
  selector: 'app-kurs',
  templateUrl: './kurs.component.html',
  styleUrls: ['./kurs.component.scss']
})
export class KursComponent implements OnInit {
  @Input() kurs: Kurs;

  constructor() { }

  ngOnInit(): void {
  }

}
