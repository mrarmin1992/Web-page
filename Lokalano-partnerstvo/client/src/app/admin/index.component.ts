import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { DogadjajiService } from '../dogadjaji/dogadjaji.service';
import { KurseviService } from '../kursevi/kursevi.service';
import { ObukeService } from '../obuke/obuke.service';
import { PublikacijeService } from '../publikacije/publikacije.service';
import { DogadjajiParams } from '../shared/models/dogadjajiParams';
import { KursParams } from '../shared/models/kursParams';
import { ObukaParams } from '../shared/models/obukaParams';
import { PublikacijaParams } from '../shared/models/publikacijaParams';
import { IUsers } from '../shared/models/users';
import { UsersParams } from '../shared/models/usersParams';
import { VijestiParams } from '../shared/models/vijestiParams';
import { VijestiService } from '../vijesti/vijesti.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  isAdmin$: Observable<boolean>;
  vijestiParams = new VijestiParams();
  brojVijesti: number;
  kursParams = new KursParams();
  brojKurseva: number;
  obukeParams = new ObukaParams();
  brojObuka: number;
  dogadjajParams = new DogadjajiParams();
  brojDogadjaja: number;
  publikacijeParams = new PublikacijaParams();
  brojPublikacija: number;
  brojKorisnika: number;

  constructor(private vijestiService: VijestiService,
              private kursService: KurseviService,
              private obukeService: ObukeService,
              private dogadjajService: DogadjajiService,
              private publikacijeService: PublikacijeService,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.isAdmin$ = this.accountService.isAdmin$;
    this.accountService.getUsers().subscribe(resp => {
      this.brojKorisnika = resp.count;
    }, error => {
      console.log(error);
    });
    this.vijestiParams.pageSize = 1;
    this.kursParams.pageSize = 1;
    this.obukeParams.pageSize = 1;
    this.dogadjajParams.pageSize = 1;
    this.publikacijeParams.pageSize = 1;
    this.vijestiService.getVijesti(this.vijestiParams).subscribe(resp => {
      this.brojVijesti = resp.count;
    }, error => {
      console.log(error);
    });
    this.kursService.getKursevi(this.kursParams).subscribe(resp => {
      this.brojKurseva = resp.count;
    }, error => {
      console.log(error);
    });
    this.obukeService.getObuke(this.obukeParams).subscribe(resp => {
      this.brojObuka = resp.count;
    }, error => {
      console.log(error);
    });
    this.dogadjajService.getDogadjaji(this.dogadjajParams).subscribe(resp => {
      this.brojDogadjaja = resp.count;
    }, error => {
      console.log(error);
    });
    this.publikacijeService.getPublikacije(this.publikacijeParams).subscribe(resp => {
      this.brojPublikacija = resp.count;
    }, error => {
      console.log(error);
    });
  }

}
