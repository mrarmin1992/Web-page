import { Component, OnInit } from '@angular/core';
import { Vijest } from 'src/app/shared/models/vijest';
import { VijestiParams } from 'src/app/shared/models/vijestiParams';
import { VijestiService } from 'src/app/vijesti/vijesti.service';

@Component({
  selector: 'app-section-kursevi',
  templateUrl: './section-kursevi.component.html',
  styleUrls: ['./section-kursevi.component.scss']
})
export class SectionKurseviComponent implements OnInit {
  vijesti: Vijest[];
  vijestiParams = new VijestiParams();

  constructor(private vijestiService: VijestiService) { }

  ngOnInit(): void {
    this.vijestiParams.pageSize = 8;
    this.vijestiService.getAllVijesti(this.vijestiParams).subscribe(resp => {
      this.vijesti = resp.data;
    }, error => {
      console.log(error);
    });
  }

}
