import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Publikacija } from '../shared/models/publikacija';
import { PublikacijaParams } from '../shared/models/publikacijaParams';
import { PublikacijeService } from './publikacije.service';

@Component({
  selector: 'app-publikacije',
  templateUrl: './publikacije.component.html',
  styleUrls: ['./publikacije.component.scss']
})
export class PublikacijeComponent implements OnInit {
  customClass = 'customClass';
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  search: string;
  publikacije: Publikacija[];
  totalCount: number;
  publikacijeParams = new PublikacijaParams();

  constructor(private publikacijeService: PublikacijeService) { }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.publikacijeService.getPublikacije(this.publikacijeParams).subscribe(response => {
      this.publikacije = response.data;
      this.totalCount = response.count;
      this.publikacijeParams.pageNumber = response.pageIndex;
      this.publikacijeParams.pageSize = response.pageSize;
    });
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  onSearch() {

  }

}
