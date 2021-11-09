import { Component, OnInit } from '@angular/core';
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { VijestiService } from 'src/app/vijesti/vijesti.service';
import { Kurs } from '../../models/kurs';
import { KursParams } from '../../models/kursParams';
import { Vijest } from '../../models/vijest';
import { VijestiParams } from '../../models/vijestiParams';

@Component({
  selector: 'app-kursevi-home',
  templateUrl: './kursevi-home.component.html',
  styleUrls: ['./kursevi-home.component.scss']
})
export class KurseviHomeComponent implements OnInit {
  kursevi: Kurs[];
  kursParams = new KursParams();

  constructor(private kursService: KurseviService,
              private vijestiService: VijestiService) { }

  ngOnInit(): void {
    this.kursParams.pageSize = 3;
    this.kursService.getAllKursevi(this.kursParams).subscribe(response => {
      console.log(response);
      this.kursevi = response.data;
    }, error => {
      console.log(error);
    });
  }

}
