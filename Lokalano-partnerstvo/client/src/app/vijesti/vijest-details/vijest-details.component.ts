import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vijest } from 'src/app/shared/models/vijest';
import { VijestiParams } from 'src/app/shared/models/vijestiParams';
import { BreadcrumbService } from 'xng-breadcrumb';
import { VijestiService } from '../vijesti.service';

@Component({
  selector: 'app-vijest-details',
  templateUrl: './vijest-details.component.html',
  styleUrls: ['./vijest-details.component.scss']
})
export class VijestDetailsComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  vijest: Vijest;
  posljednjeVijesti: Vijest[];
  slicneVijesti: Vijest[];
  vijestiParams: VijestiParams;

  constructor(private vijestService: VijestiService,
              private route: ActivatedRoute,
              private bcService: BreadcrumbService) {
                this.vijestiParams = new VijestiParams();
              }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.loadVijest();
    this.loadPosljednje();
  }
  loadSlicne(id: number): void {
    this.vijestiParams.pageSize = 2;
    this.vijestiParams.kategorijaId = id;
    this.vijestService.getAllVijesti(this.vijestiParams).subscribe(resp => {
      this.slicneVijesti = resp.data;
      console.log(resp.data);
    });
  }
  loadPosljednje(): void {
    this.vijestiParams.pageSize = 10;
    this.vijestService.getAllVijesti(this.vijestiParams).subscribe(resp => {
      this.posljednjeVijesti = resp.data;
    });
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  // tslint:disable-next-line: typedef
  loadVijest() {
    this.vijestService.getVijest(+this.route.snapshot.paramMap.get('id')).subscribe(vijest => {
      this.vijest = vijest;
      this.bcService.set('@vijestiDetails', vijest.naslov);
      this.loadSlicne(vijest.vijestKategorijaId);
    }, error => {
      console.log(error);
    });
  }
}
