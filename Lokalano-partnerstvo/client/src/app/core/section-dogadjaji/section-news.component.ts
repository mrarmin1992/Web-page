import { Component, OnInit } from '@angular/core';
import { DogadjajiService } from 'src/app/dogadjaji/dogadjaji.service';
import { Dogadjaj } from 'src/app/shared/models/dogadjaj';
import { DogadjajiParams } from 'src/app/shared/models/dogadjajiParams';

@Component({
  selector: 'app-section-news',
  templateUrl: './section-news.component.html',
  styleUrls: ['./section-news.component.scss']
})
export class SectionNewsComponent implements OnInit {
  dogadjaji: Dogadjaj[];
  dogadjajiParams = new DogadjajiParams();

  constructor(private dogadjajiService: DogadjajiService) { }

  ngOnInit(): void {
    this.dogadjajiParams.pageSize = 5;
    this.dogadjajiService.getAllDogadjaji(this.dogadjajiParams).subscribe(resp => {
      this.dogadjaji = resp.data;
    }, error => {
      console.log(error);
    });
  }
}
