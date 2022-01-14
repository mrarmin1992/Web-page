import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  ImageSettingsModel,
} from '@syncfusion/ej2-angular-richtexteditor';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { VijestFormValues } from 'src/app/shared/models/vijest';
import { VijestiKategorije } from 'src/app/shared/models/vijestiKategorije';
import { VijestiService } from 'src/app/vijesti/vijesti.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-edit-vijest',
  templateUrl: './edit-vijest.component.html',
  styleUrls: ['./edit-vijest.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
})
export class EditVijestComponent implements OnInit {
  title = '';
  nova: boolean;
  files: File[] = [];
  progress = 0;
  vijest: VijestFormValues;
  vijestiKategorije: VijestiKategorije[];
  selectedObj = 'Odaberite kategoriju';
  public insertImageSettings: ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null, };
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
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen'
    ],
  };
  public iframe: object = { enable: true };
  public height = 300;
  constructor(
    private vijestiService: VijestiService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private cds: ConfirmationDialogService
  ) {
    this.vijest = new VijestFormValues();
  }

  ngOnInit(): void {
    this.nova = true;
    this.getKategorije();
    if (this.route.snapshot.url[0].path === 'vijest-edit') {
      this.title = 'Izmjena vijesti';
      this.nova = false;
      this.loadVijest();
    } else {
      this.title = 'Dodavanje nove vijesti';
    }
    this.vijest.fokus = false;
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
    this.adminService.uploadImage(new File([base64ToFile(this.croppedImage)], file.name), id, 'vijesti').subscribe(
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
  loadVijest() {
    this.vijestiService
      .getVijest(+this.route.snapshot.paramMap.get('id'))
      .subscribe((response: any) => {
        const vijestKategorijaId =
          this.vijestiKategorije &&
          this.vijestiKategorije.find(
            (x) => x.naziv === response.vijestKategorija
          ).id;
        this.vijest = { ...response, vijestKategorijaId };
        const datePipe = new DatePipe('en-US');
        const formatedyear = datePipe.transform(
          this.vijest.datum,
          'yyyy-MM-dd'
        );
        this.vijest.datum = formatedyear;
      });
  }
  // tslint:disable-next-line: typedef
  getKategorije() {
    this.vijestiService.getVijestiKategorije().subscribe((kategorije) => {
      this.vijestiKategorije = kategorije;
    });
  }

  // tslint:disable-next-line: typedef
  onSubmit(vijest: VijestFormValues) {
    if (this.route.snapshot.url[0].path === 'vijest-edit') {
      const updatedVijest = { ...this.vijest, ...vijest };
      if (this.selectedObj !== 'Odaberite kategoriju') {
        updatedVijest.vijestKategorijaId = +this.selectedObj;
      }
      if (vijest.fokus === undefined) {
        vijest.fokus = false;
      }
      this.vijestiService
        .updateVijest(updatedVijest, +this.route.snapshot.paramMap.get('id'))
        .subscribe((response: any) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], response.id);
          }
          this.router.navigate(['/dashboard/vijesti-dashboard']);
        });
      if (vijest.fokus === undefined) {
        vijest.fokus = false;
      }
    } else {
      const newVijest = { ...vijest };
      if (this.selectedObj === 'Odaberite kategoriju') {
        this.cds.alert('Kategorija', 'Molimo odaberite kategoriju.', 'Uredu');
      } else {
        newVijest.vijestKategorijaId = +this.selectedObj;
        if (vijest.fokus === undefined) {
          vijest.fokus = false;
        }
        this.vijestiService
          .createVijest(newVijest)
          .subscribe((response: any) => {
            if (this.files[0]) {
              this.uploadFile(this.files[0], response.id);
            }
            this.router.navigate(['/dashboard/vijesti-dashboard']);
          });
      }
    }
  }
}
