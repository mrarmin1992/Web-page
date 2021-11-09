import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Obuka } from 'src/app/shared/models/obuka';
import { ObukaParams } from 'src/app/shared/models/obukaParams';
import { ObukeService } from '../obuke.service';

@Component({
  selector: 'app-obuke-details',
  templateUrl: './obuke-details.component.html',
  styleUrls: ['./obuke-details.component.scss']
})
export class ObukeDetailsComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  obuka: Obuka;
  obuke: Obuka[];
  posljednjeObuke: Obuka[];
  slicneObuke: Obuka[];
  obukaParams = new ObukaParams();

  constructor(private obukeService: ObukeService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.loadObuka();
    this.loadPosljednje();
  }

  loadPosljednje(): void {
    this.obukaParams.pageSize = 10;
    this.obukeService.getAllObuke(this.obukaParams).subscribe(resp => {
      this.posljednjeObuke = resp.data;
    });
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  // tslint:disable-next-line: typedef
  loadObuka() {
    this.obukeService.getObuka(+this.route.snapshot.paramMap.get('id')).subscribe(obuka => {
      this.obuka = obuka;
      this.loadSlicni(obuka.obukaKategorijaId, obuka);
    }, error => {
      console.log(error);
    });
  }
  loadSlicni(obukaKategorijaId: number, obuka: Obuka): void {
    this.obukaParams.pageSize = 3;
    this.obukaParams.kategorijaId = obukaKategorijaId;
    this.obukeService.getAllObuke(this.obukaParams).subscribe(resp => {
      this.slicneObuke = resp.data;
      const index = this.slicneObuke.findIndex(d => d.id === obuka.id);
      this.slicneObuke.splice(index, 1);
    });
  }
}
