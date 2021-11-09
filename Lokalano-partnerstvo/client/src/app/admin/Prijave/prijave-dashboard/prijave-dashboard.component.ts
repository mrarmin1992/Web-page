import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { ObukeService } from 'src/app/obuke/obuke.service';
import { PrijavaService } from 'src/app/prijava/prijava.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Kurs } from 'src/app/shared/models/kurs';
import { KursParams } from 'src/app/shared/models/kursParams';
import { Obuka } from 'src/app/shared/models/obuka';
import { ObukaParams } from 'src/app/shared/models/obukaParams';
import { Prijava } from 'src/app/shared/models/prijava';
import { PrijavaParams } from 'src/app/shared/models/prijavaParams';

class SelectProps {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-prijave-dashboard',
  templateUrl: './prijave-dashboard.component.html',
  styleUrls: ['./prijave-dashboard.component.scss']
})
export class PrijaveDashboardComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  search: string;
  prijave: Prijava[];
  selectKurs: SelectProps[] = [];
  selectObuka: SelectProps[] = [];
  totalCount: number;
  prijaveParams = new PrijavaParams();
  kursParams = new KursParams();
  obukaParams = new ObukaParams();
  pogledanoOptions = [
    {name: 'Sve prijave', value: null},
    {name: 'Pregledane', value: true},
    {name: 'Nepregledane', value: false}
  ];

  constructor(private prijaveService: PrijavaService,
              private kursService: KurseviService,
              private obukaService: ObukeService,
              private cds: ConfirmationDialogService) {
                this.prijaveParams = this.prijaveService.getPrijavaParams();
               }

  ngOnInit(): void {
    this.selectKurs.push(new SelectProps(null, 'Odaberite kurs'));
    this.selectObuka.push(new SelectProps(null, 'Odaberite obuku'));
    this.loadPrijave();
    this.kursParams.pageSize = 10;
    this.kursService.getKursevi(this.kursParams).subscribe(response => {
      response.data.forEach((item: Kurs) => {
        this.selectKurs.push(new SelectProps(item.id, item.naziv));
      });
    });
    this.obukaParams.pageSize = 10;
    this.obukaService.getObuke(this.obukaParams).subscribe(response => {
      response.data.forEach((item: Obuka) => {
        this.selectObuka.push(new SelectProps(item.id, item.naziv));
      });
    });
  }
  delete(prijava: Prijava): void {
    this.cds.confirm('Pažnja', 'Jeste li sigurni da želite obrisati odabranu prijavu?', 'Obriši', 'Odustani')
      .then((confirmed) => {
        if (confirmed) {
          this.prijaveService.deletePrijava(prijava.id).subscribe((response: any) => {
            this.loadPrijave();
          }, error => {
            console.log(error);
          });
        }
      });
  }

  onPogledanoSelected(pogledano: any): void {
    const params = this.prijaveService.getPrijavaParams();
    params.pogledano = pogledano;
    this.prijaveService.setPrijavaParams(params);
    this.loadPrijave();
  }
  onKursSelected(kursId: number): void {
    const params = this.prijaveService.getPrijavaParams();
    params.kursId = kursId;
    params.obukaId = null;
    this.prijaveService.setPrijavaParams(params);
    this.loadPrijave();
  }

  onObukaSelected(obukaId: number): void {
    const params = this.prijaveService.getPrijavaParams();
    params.obukaId = obukaId;
    params.kursId = null;
    this.prijaveService.setPrijavaParams(params);
    this.loadPrijave();
  }

  loadPrijave(): void {
    this.prijaveService.getPrijave().subscribe(response => {
      console.log(response);
      this.prijave = response.data;
      this.totalCount = response.count;
      this.prijaveParams.pageNumber = response.pageIndex;
      this.prijaveParams.pageSize = response.pageSize;
    });
  }

  onSearch(): void {
    const params = this.prijaveService.getPrijavaParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.prijaveService.setPrijavaParams(params);
    this.loadPrijave();
  }

  onReset(): void {
    this.searchTerm.nativeElement.value = '';
    this.prijaveParams = new PrijavaParams();
    this.prijaveService.setPrijavaParams(this.prijaveParams);
    this.loadPrijave();
  }

  checkValue(prijava: Prijava): void {
    this.prijaveService.updatePrijava(prijava, prijava.id).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }
}
