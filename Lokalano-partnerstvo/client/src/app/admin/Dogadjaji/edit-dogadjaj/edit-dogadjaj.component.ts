import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HtmlEditorService,
  ImageService,
  LinkService,
  ToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { DogadjajiService } from 'src/app/dogadjaji/dogadjaji.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { DogadjajFormValues } from 'src/app/shared/models/dogadjaj';
import { DogadjajiKategorije } from 'src/app/shared/models/dogadjajiKategorije';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-edit-dogadjaj',
  templateUrl: './edit-dogadjaj.component.html',
  styleUrls: ['./edit-dogadjaj.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
})
export class EditDogadjajComponent implements OnInit {
  title = '';
  novi: boolean;
  files: File[] = [];
  progress = 0;
  dogadjaj: DogadjajFormValues;
  dogadjajiKategorije: DogadjajiKategorije[];
  selectedObj = 'Odaberite kategoriju';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  public fontFamily: object = {
    items: [
      {
        text: 'Segoe UI',
        value: 'Segoe UI',
        class: 'e-segoe-ui',
        command: 'Font',
        subCommand: 'FontName',
      },
      {
        text: 'Roboto',
        value: 'Roboto',
        command: 'Font',
        subCommand: 'FontName',
      }, // here font is added
      {
        text: 'Great vibes',
        value: 'Great Vibes,cursive',
        command: 'Font',
        subCommand: 'FontName',
      }, // here font is added
      {
        text: 'Noto Sans',
        value: 'Noto Sans',
        command: 'Font',
        subCommand: 'FontName',
      },
      {
        text: 'Impact',
        value: 'Impact,Charcoal,sans-serif',
        class: 'e-impact',
        command: 'Font',
        subCommand: 'FontName',
      },
      {
        text: 'Tahoma',
        value: 'Tahoma,Geneva,sans-serif',
        class: 'e-tahoma',
        command: 'Font',
        subCommand: 'FontName',
      },
    ],
  };
  public tools: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'Formats',
      'Alignments',
      '|',
      'OrderedList',
      'UnorderedList',
      '|',
      'Indent',
      'Outdent',
      '|',
      'CreateLink',
      '|',
      'Print',
      'SourceCode',
    ],
  };
  public iframe: object = { enable: true };
  public height = 300;
  constructor(
    private dogadjajiService: DogadjajiService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private cds: ConfirmationDialogService
  ) {
    this.dogadjaj = new DogadjajFormValues();
  }

  ngOnInit(): void {
    this.novi = true;
    this.getKategorije();
    if (this.route.snapshot.url[0].path === 'dogadjaj-edit') {
      this.title = 'Izmjena događaja';
      this.novi = false;
      this.loadDogadjaj();
    } else {
      this.title = 'Dodavanje novog događaja';
    }
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  // tslint:disable-next-line: typedef
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  // tslint:disable-next-line: typedef
  onSelect(event) {
    this.files = [];
    this.files.push(...event.addedFiles);
  }
  // tslint:disable-next-line: typedef
  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // tslint:disable-next-line: typedef
  uploadFile(file: File, id: number) {
    this.adminService.uploadImage(new File([base64ToFile(this.croppedImage)], file.name), id, 'dogadjaji').subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            break;
        }
      },
      (error) => {
        console.log(error);
        this.progress = 0;
      }
    );
  }
  // tslint:disable-next-line: typedef
  loadDogadjaj() {
    this.dogadjajiService
      .getDogadjaj(+this.route.snapshot.paramMap.get('id'))
      .subscribe((response: any) => {
        const dogadjajKategorijaId =
          this.dogadjajiKategorije &&
          this.dogadjajiKategorije.find(
            (x) => x.naziv === response.dogadjajKategorija
          ).id;
        this.dogadjaj = { ...response, dogadjajKategorijaId };
        const datePipe = new DatePipe('en-US');
        const formatedYearObjava = datePipe.transform(
          this.dogadjaj.datumObjave,
          'yyyy-MM-dd'
        );
        const formatedYearPocetak = datePipe.transform(
          this.dogadjaj.datumPocetka,
          'yyyy-MM-dd'
        );
        this.dogadjaj.datumObjave = formatedYearObjava;
        this.dogadjaj.datumPocetka = formatedYearPocetak;
      });
  }
  // tslint:disable-next-line: typedef
  getKategorije() {
    this.dogadjajiService.getDogadjajiKategorije().subscribe((kategorije) => {
      this.dogadjajiKategorije = kategorije;
    });
  }

  // tslint:disable-next-line: typedef
  onSubmit(dogadjaj: DogadjajFormValues) {
    if (this.route.snapshot.url[0].path === 'dogadjaj-edit') {
      const updatedDogadjaj = { ...this.dogadjaj, ...dogadjaj };
      if (this.selectedObj !== 'Odaberite kategoriju') {
        updatedDogadjaj.dogadjajKategorijaId = +this.selectedObj;
      }
      this.dogadjajiService
        .updateDogadjaj(
          updatedDogadjaj,
          +this.route.snapshot.paramMap.get('id')
        )
        .subscribe((response: any) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], response.id);
          }
          this.router.navigate(['/dashboard/dogadjaji-dashboard']);
        });
    } else {
      const newDogadjaj = { ...dogadjaj };
      if (this.selectedObj === 'Odaberite kategoriju') {
        this.cds.alert('Kategorija', 'Molimo odaberite kategoriju.', 'Uredu');
      } else {
        newDogadjaj.dogadjajKategorijaId = +this.selectedObj;
        this.dogadjajiService
          .createDogadjaj(newDogadjaj)
          .subscribe((response: any) => {
            if (this.files[0]) {
              this.uploadFile(this.files[0], response.id);
            }
            this.router.navigate(['/dashboard/dogadjaji-dashboard']);
          });
      }
    }
  }
}
