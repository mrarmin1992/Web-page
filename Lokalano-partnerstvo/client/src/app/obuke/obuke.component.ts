import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IKategorije } from '../shared/models/kategorije';
import { Obuka } from '../shared/models/obuka';
import { ObukaParams } from '../shared/models/obukaParams';
import { ObukeService } from './obuke.service';

@Component({
  selector: 'app-obuke',
  templateUrl: './obuke.component.html',
  styleUrls: ['./obuke.component.scss']
})
export class ObukeComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  obuke: Obuka[];
  kategorije: IKategorije[];
  obukaParams = new ObukaParams();
  totalCount: number;
  sortOptions = [
    {name: 'Abecedno', value: 'Naslov'},
    {name: 'Datum objave', value: 'DateAsc'},
    {name: 'Datum objave desc', value: 'DateDesc'}
  ];
  constructor(private obukeService: ObukeService) { }

  ngOnInit(): void {
    this.getObuke();
    this.getKategorije();
  }

  // tslint:disable-next-line: typedef
  getObuke() {
    this.obukeService.getObuke(this.obukaParams).subscribe((response) => {

      this.obuke = response.data;
      this.obukaParams.pageNumber = response.pageIndex;
      this.obukaParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }

  // tslint:disable-next-line: typedef
  getKategorije() {
    this.obukeService.getObukeKategorije().subscribe(response => {
      this.kategorije = [{id: 0, naziv: 'Sve'}, ...response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line: typedef
  onKategorijaSelected(kategorijaId: number) {
    this.obukaParams.kategorijaId = kategorijaId;
    this.obukaParams.pageNumber = 1;
    this.getObuke();
  }

  // tslint:disable-next-line: typedef
  onSortSelected(sort: string) {
    this.obukaParams.sort = sort;
    this.getObuke();
  }

  // tslint:disable-next-line: typedef
  onPageChanged(event: any) {
    if (this.obukaParams.pageNumber !== event) {
      this.obukaParams.pageNumber = event;
      this.getObuke();
    }
  }

  // tslint:disable-next-line: typedef
  onSearch() {
    this.obukaParams.search = this.searchTerm.nativeElement.value;
    this.obukaParams.pageNumber = 1;
    this.getObuke();
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.obukaParams = new ObukaParams();
    this.getObuke();
  }

}
