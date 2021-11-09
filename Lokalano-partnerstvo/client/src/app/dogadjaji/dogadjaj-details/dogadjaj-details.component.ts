import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dogadjaj } from 'src/app/shared/models/dogadjaj';
import { DogadjajiParams } from 'src/app/shared/models/dogadjajiParams';
import { BreadcrumbService } from 'xng-breadcrumb';
import { DogadjajiService } from '../dogadjaji.service';

@Component({
  selector: 'app-dogadjaj-details',
  templateUrl: './dogadjaj-details.component.html',
  styleUrls: ['./dogadjaj-details.component.scss']
})
export class DogadjajDetailsComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  dogadjaj: Dogadjaj;
  dogadjaji: Dogadjaj[];
  posljednjiDogadjaji: Dogadjaj[];
  slicniDogadjaji: Dogadjaj[];
  dogadjajParams = new DogadjajiParams();

  constructor(private dogadjajService: DogadjajiService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.loadDogadjaj();
    this.loadPosljednje();
  }
  loadPosljednje(): void {
    this.dogadjajParams.pageSize = 10;
    this.dogadjajService.getAllDogadjaji(this.dogadjajParams).subscribe(resp => {
      this.posljednjiDogadjaji = resp.data;
    });
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  // tslint:disable-next-line: typedef
  loadDogadjaj() {
    this.dogadjajService.getDogadjaj(+this.route.snapshot.paramMap.get('id')).subscribe(dogadjaj => {
      this.dogadjaj = dogadjaj;
      this.loadSlicni(dogadjaj.dogadjajKategorijaId, dogadjaj);
    }, error => {
      console.log(error);
    });
  }
  loadSlicni(dogadjajKategorijaId: any, dogadjaj: Dogadjaj): void {
    this.dogadjajParams.pageSize = 3;
    this.dogadjajParams.kategorijaId = dogadjajKategorijaId;
    this.dogadjajService.getAllDogadjaji(this.dogadjajParams).subscribe(resp => {
      this.slicniDogadjaji = resp.data;
      const index = this.slicniDogadjaji.findIndex(d => d.id === dogadjaj.id);
      this.slicniDogadjaji.splice(index, 1);
    });
  }

}
