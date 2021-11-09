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
import { PublikacijeService } from 'src/app/publikacije/publikacije.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Photo } from 'src/app/shared/models/kurs';
import { PubFormValues } from 'src/app/shared/models/publikacija';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-edit-publikacije',
  templateUrl: './edit-publikacije.component.html',
  styleUrls: ['./edit-publikacije.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
})
export class EditPublikacijeComponent implements OnInit {
  title = '';
  novi: boolean;
  files: File[] = [];
  photos: File[] = [];
  progress = 0;
  publikacija: PubFormValues;
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
    private route: ActivatedRoute,
    private router: Router,
    private publikacijeService: PublikacijeService,
    private cds: ConfirmationDialogService,
    private adminService: AdminService
  ) {
    this.publikacija = new PubFormValues();
  }

  ngOnInit(): void {
    this.novi = true;
    if (this.route.snapshot.url[0].path === 'publikacije-edit') {
      this.title = 'Izmjena dokumenta';
      this.novi = false;
      this.loadPub();
    } else {
      this.title = 'Dodavanje novog dokumenta';
    }
  }

  loadPub(): void {
    this.publikacijeService
      .getPublikacija(+this.route.snapshot.paramMap.get('id'))
      .subscribe((response) => {
        console.log(response);
        const datum = response.datumObjavljivanja.toString();
        this.publikacija = { ...response, datumObjavljivanja: datum };
        const datePipe = new DatePipe('en-US');
        const formatedYearObjava = datePipe.transform(
          this.publikacija.datumObjavljivanja,
          'yyyy-MM-dd'
        );
        this.publikacija.datumObjavljivanja = formatedYearObjava;
      });
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  // tslint:disable-next-line: typedef
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  // tslint:disable-next-line: typedef
  onFileSelect(event) {
    this.files = [];
    this.files.push(...event.addedFiles);
    console.log(event);
  }
  onPhotoSelect(event) {
    this.photos = [];
    this.photos.push(...event.addedFiles);
    console.log(event);
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
    this.adminService.uploadFile(file, id, 'publikacije').subscribe(
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
  uploadPhoto(file: File, id: number) {
    this.adminService.uploadImage(new File([base64ToFile(this.croppedImage)], file.name), id, 'publikacije').subscribe(
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
  onSubmit(publikacija: PubFormValues) {
    if (this.route.snapshot.url[0].path === 'publikacije-edit') {
      const updatedPub = { ...this.publikacija, ...publikacija };
      this.publikacijeService
        .updatePublikacija(updatedPub, +this.route.snapshot.paramMap.get('id'))
        .subscribe((response: any) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], response.id);
          }
          if (this.photos[0]) {
            this.uploadPhoto(this.photos[0], response.id);
          }
          this.router.navigate(['/dashboard/publikacije-dashboard']);
        });
    } else {
      const newPub = { ...publikacija };
      this.publikacijeService.createPublikacija(newPub).subscribe((response: any) => {
        if (this.files[0]) {
          this.uploadFile(this.files[0], response.id);
        }
        if (this.photos[0]) {
          this.uploadPhoto(this.photos[0], response.id);
        }
        this.router.navigate(['/dashboard/publikacije-dashboard']);
      });
    }
  }
}
