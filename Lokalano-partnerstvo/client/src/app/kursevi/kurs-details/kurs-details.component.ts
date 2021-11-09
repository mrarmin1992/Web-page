import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Kurs } from 'src/app/shared/models/kurs';
import { KursParams } from 'src/app/shared/models/kursParams';
import { KurseviService } from '../kursevi.service';

@Component({
  selector: 'app-kurs-details',
  templateUrl: './kurs-details.component.html',
  styleUrls: ['./kurs-details.component.scss']
})
export class KursDetailsComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  kurs: Kurs;
  kursevi: Kurs[];
  posljednjiKursevi: Kurs[];
  slicniKursevi: Kurs[];
  kursParams = new KursParams();

  constructor(private kursService: KurseviService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.loadKurs();
    this.loadPosljednje();
  }
  loadPosljednje(): void {
    this.kursParams.pageSize = 10;
    this.kursService.getAllKursevi(this.kursParams).subscribe(resp => {
      this.posljednjiKursevi = resp.data;
      console.log(resp);
    });
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  // tslint:disable-next-line: typedef
  loadKurs() {
    this.kursService.getKurs(+this.route.snapshot.paramMap.get('id')).subscribe(kurs => {
      this.kurs = kurs;
      this.loadSlicni(kurs.kursKategorijaId, kurs);
    }, error => {
      console.log(error);
    });
  }
  loadSlicni(kursKategorijaId: number, kurs: Kurs): void {
    this.kursParams.pageSize = 3;
    this.kursParams.kategorijaId = kursKategorijaId;
    this.kursService.getAllKursevi(this.kursParams).subscribe(resp => {
      this.slicniKursevi = resp.data;
      const index = this.slicniKursevi.findIndex(d => d.id === kurs.id);
      this.slicniKursevi.splice(index, 1);
    });
  }
}
