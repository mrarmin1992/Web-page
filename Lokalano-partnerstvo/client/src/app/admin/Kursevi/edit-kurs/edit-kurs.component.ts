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
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { IKategorije } from 'src/app/shared/models/kategorije';
import { KursFormValues } from 'src/app/shared/models/kurs';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-edit-kurs',
  templateUrl: './edit-kurs.component.html',
  styleUrls: ['./edit-kurs.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
})
export class EditKursComponent implements OnInit {
  title = '';
  novi: boolean;
  files: File[] = [];
  progress = 0;
  kurs: KursFormValues;
  kurseviKategorije: IKategorije[];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  selectedObj = 'Odaberite kategoriju';
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
    private kurseviService: KurseviService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private cds: ConfirmationDialogService
  ) {
    this.kurs = new KursFormValues();
  }

  ngOnInit(): void {
    this.novi = true;
    this.getKategorije();
    if (this.route.snapshot.url[0].path === 'kurs-edit') {
      this.title = 'Izmjena kursa';
      this.novi = false;
      this.loadKurs();
    } else {
      this.title = 'Dodavanje novog kursa';
    }
    this.kurs.fokus = false;
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
    this.adminService.uploadImage(new File([base64ToFile(this.croppedImage)], file.name), id, 'kursevi').subscribe(
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
  loadKurs() {
    this.kurseviService
      .getKurs(+this.route.snapshot.paramMap.get('id'))
      .subscribe((response: any) => {
        const kursKategorijaId =
          this.kurseviKategorije &&
          this.kurseviKategorije.find(
            (x) => x.naziv === response.kursKategorija
          ).id;
        this.kurs = { ...response, kursKategorijaId };
        const datePipe = new DatePipe('en-US');
        const formatedYearObjava = datePipe.transform(
          this.kurs.datumObjave,
          'yyyy-MM-dd'
        );
        const formatedYearPocetak = datePipe.transform(
          this.kurs.datumObjave,
          'yyyy-MM-dd'
        );
        this.kurs.datumObjave = formatedYearObjava;
        this.kurs.datumPocetka = formatedYearPocetak;
      });
  }
  // tslint:disable-next-line: typedef
  getKategorije() {
    this.kurseviService.getKurseviKategorije().subscribe((kategorije) => {
      this.kurseviKategorije = kategorije;
    });
  }

  // tslint:disable-next-line: typedef
  onSubmit(kurs: KursFormValues) {
    if (this.route.snapshot.url[0].path === 'kurs-edit') {
      const updatedKurs = { ...this.kurs, ...kurs };
      if (this.selectedObj !== 'Odaberite kategoriju') {
        updatedKurs.kursKategorijaId = +this.selectedObj;
      }
      if (kurs.fokus === undefined) {
        kurs.fokus = false;
      }
      this.kurseviService
        .updateKurs(updatedKurs, +this.route.snapshot.paramMap.get('id'))
        .subscribe((response: any) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], response.id);
          }
          this.router.navigate(['/dashboard/kurs-dashboard']);
        });
      if (kurs.fokus === undefined) {
        kurs.fokus = false;
      }
    } else {
      const newKurs = { ...kurs };
      if (this.selectedObj === 'Odaberite kategoriju') {
        this.cds.alert('Kategorija', 'Molimo odaberite kategoriju.', 'Uredu');
      } else {
        newKurs.kursKategorijaId = +this.selectedObj;
        if (kurs.fokus === undefined) {
          kurs.fokus = false;
        }
        this.kurseviService.createKurs(newKurs).subscribe((response: any) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], response.id);
          }
          this.router.navigate(['/dashboard/kurs-dashboard']);
        });
      }
    }
  }
}
