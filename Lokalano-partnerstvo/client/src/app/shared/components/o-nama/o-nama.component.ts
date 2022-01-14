import { Component, OnInit } from '@angular/core';
import { PartneriService } from 'src/app/admin/Korisnici/partneri.service';
import { Partner } from '../../models/partner';
import { PartnerParams } from '../../models/partnerParams';

@Component({
  selector: 'app-o-nama',
  templateUrl: './o-nama.component.html',
  styleUrls: ['./o-nama.component.scss']
})
export class ONamaComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  partneri: Partner[];
  partneriParams: PartnerParams;
  totalCount: number;

  constructor(private partneriService: PartneriService) { }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('foo');
    }
    this.changeTheme(this.color, this.hoverColor);
    this.partneriParams = new PartnerParams();
    this.partneriParams.pageSize = 50;
    this.partneriService.getPartneri(this.partneriParams).subscribe(resp => {
      this.partneri = resp.data;
      this.partneri.forEach(item => {
        item.opis = item.opis.substr(0, 200);
        item.opis += '...';
      });
      this.totalCount = resp.count;
    });
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
  loadOnce(): void {
    window.location.reload();
  }
}
