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
import { ObukeService } from 'src/app/obuke/obuke.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { ObukaFormValues } from 'src/app/shared/models/obuka';
import { ObukeKategorije } from 'src/app/shared/models/obukeKategorije';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-edit-obuka',
  templateUrl: './edit-obuka.component.html',
  styleUrls: ['./edit-obuka.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
})
export class EditObukaComponent implements OnInit {
  title = '';
  nova: boolean;
  files: File[] = [];
  progress = 0;
  obuka: ObukaFormValues;
  obukeKategorije: ObukeKategorije[];
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
    private obukeService: ObukeService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private cds: ConfirmationDialogService
  ) {
    this.obuka = new ObukaFormValues();
  }

  ngOnInit(): void {
    this.nova = true;
    this.getKategorije();
    if (this.route.snapshot.url[0].path === 'obuka-edit') {
      this.title = 'Izmjena obuke';
      this.nova = false;
      this.loadObuka();
    } else {
      this.title = 'Dodavanje nove obuke';
    }
    this.obuka.fokus = false;
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
    this.adminService.uploadImage(new File([base64ToFile(this.croppedImage)], file.name), id, 'obuka').subscribe(
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
  loadObuka() {
    this.obukeService
      .getObuka(+this.route.snapshot.paramMap.get('id'))
      .subscribe((response: any) => {
        const obukaKategorijaId =
          this.obukeKategorije &&
          this.obukeKategorije.find((x) => x.naziv === response.obukaKategorija)
            .id;
        this.obuka = { ...response, obukaKategorijaId };
        const datePipe = new DatePipe('en-US');
        const formatedYearObjava = datePipe.transform(this.obuka.datumObjave, 'yyyy-MM-dd');
        const formatedYeaPocetak = datePipe.transform(this.obuka.datumPocetka, 'yyyy-MM-dd');
        this.obuka.datumObjave = formatedYearObjava;
        this.obuka.datumPocetka = formatedYeaPocetak;
      });
  }
  // tslint:disable-next-line: typedef
  getKategorije() {
    this.obukeService.getObukeKategorije().subscribe((kategorije) => {
      this.obukeKategorije = kategorije;
    });
  }

  // tslint:disable-next-line: typedef
  onSubmit(obuka: ObukaFormValues) {
    if (this.route.snapshot.url[0].path === 'obuka-edit') {
      const updatedObuka = { ...this.obuka, ...obuka };
      if (this.selectedObj !== 'Odaberite kategoriju') {
        updatedObuka.obukaKategorijaId = +this.selectedObj;
      }
      if (obuka.fokus === undefined) {
        obuka.fokus = false;
      }
      this.obukeService
        .updateObuka(updatedObuka, +this.route.snapshot.paramMap.get('id'))
        .subscribe((response: any) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], response.id);
          }
          this.router.navigate(['/dashboard/obuke-dashboard']);
        });
      if (obuka.fokus === undefined) {
        obuka.fokus = false;
      }
    } else {
      const newObuka = { ...obuka };
      if (this.selectedObj === 'Odaberite kategoriju') {
        this.cds.alert('Kategorija', 'Molimo odaberite kategoriju.', 'Uredu');
      } else {
        newObuka.obukaKategorijaId = +this.selectedObj;
        if (obuka.fokus === undefined) {
          obuka.fokus = false;
        }
        this.obukeService.createObuka(newObuka).subscribe((response: any) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], response.id);
          }
          this.router.navigate(['/dashboard/obuke-dashboard']);
        });
      }
    }
  }
}
