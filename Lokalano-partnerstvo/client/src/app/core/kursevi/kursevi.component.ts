import { Component, OnInit } from '@angular/core';
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { ObukeService } from 'src/app/obuke/obuke.service';
import { Kurs } from 'src/app/shared/models/kurs';
import { KursParams } from 'src/app/shared/models/kursParams';
import { Obuka } from 'src/app/shared/models/obuka';
import { ObukaParams } from 'src/app/shared/models/obukaParams';

@Component({
  selector: 'app-kursevi',
  templateUrl: './kursevi.component.html',
  styleUrls: ['./kursevi.component.scss']
})
export class KurseviComponent implements OnInit {
  kursevi: Kurs[];
  kursParams = new KursParams();
  obuke: Obuka[];
  obukeParams = new ObukaParams();

  constructor(private kursService: KurseviService,
              private obukaService: ObukeService) {
                this.ngOnInit();
              }

  ngOnInit(): void {
    this.kursParams.pageSize = 4;
    console.log(this.kursParams);
    this.kursService.getAllKursevi(this.kursParams).subscribe(resp => {
      console.log(resp);
      this.kursevi = resp.data;
      console.log(resp);
    }, error => {
      console.log(error);
    });
    this.obukeParams.pageSize = 3;
    this.obukaService.getAllObuke(this.obukeParams).subscribe(resp => {
      this.obuke = resp.data;
    }, error => {
      console.log(error);
    });
  }

}
