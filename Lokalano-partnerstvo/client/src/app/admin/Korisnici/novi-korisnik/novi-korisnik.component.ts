import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { Partner, PartnerFormValues } from 'src/app/shared/models/partner';
import { PartneriService } from '../partneri.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AdminService } from '../../admin.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-novi-korisnik',
  templateUrl: './novi-korisnik.component.html',
  styleUrls: ['./novi-korisnik.component.scss'],
})
export class NoviKorisnikComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[] = [];
  partner: PartnerFormValues;
  files: File[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  progress = 0;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private partneriService: PartneriService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.partner = new PartnerFormValues();
    this.createRegisterForm();
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
    this.adminService.uploadImage(file, id, 'partneri').subscribe(
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
  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
        ],
        [this.validateEmailNotTaken()],
      ],
      password: [null, Validators.required],
      opis: [null, [Validators.required]],
      telefon: [null, [Validators.required]],
      fax: [null],
      adresa: [null, [Validators.required]],
      web: [null],
      facebook: [null],
      instagram: [null],
      tiktok: [null],
      youtube: [null],
      twitter: [null],
    });
  }

  // tslint:disable-next-line: typedef
  onSubmit() {
    this.accountService.register({displayName: this.registerForm.get('displayName').value,
                                  email: this.registerForm.get('email').value,
                                  password: this.registerForm.get('password').value
  }).subscribe(
      (response: any) => {
        this.partneriService.register({userId: response.id,
                                       ime: response.displayName,
                                       opis: this.registerForm.get('opis').value,
                                       telefon: this.registerForm.get('telefon').value,
                                       fax: this.registerForm.get('fax').value,
                                       mail: response.email,
                                       adresa: this.registerForm.get('adresa').value,
                                       web: this.registerForm.get('web').value,
                                       facebook: this.registerForm.get('facebook').value,
                                       instagram: this.registerForm.get('instagram').value,
                                       tiktok: this.registerForm.get('tiktok').value,
                                       youtube: this.registerForm.get('youtube').value,
                                       twitter: this.registerForm.get('twitter').value
        }).subscribe((partner: Partner) => {
          if (this.files[0]) {
            this.uploadFile(this.files[0], partner.id);
            this.router.navigateByUrl('/dashboard/korisnici');
          }
          this.router.navigateByUrl('/dashboard/korisnici');
        }, error => {
          this.errors = [];
          this.errors.push(error.error.errors);
        });
      },
      (error) => {
        this.errors = [];
        this.errors .push(error.error.errors);
      }
    );
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control) => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map((res) => {
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }
}
