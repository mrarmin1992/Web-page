import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { Partner, PartnerToUpdate } from 'src/app/shared/models/partner';
import { AdminService } from '../../admin.service';
import { PartneriService } from '../partneri.service';

@Component({
  selector: 'app-korisnik',
  templateUrl: './korisnik.component.html',
  styleUrls: ['./korisnik.component.scss'],
})
export class KorisnikComponent implements OnInit {
  isAdmin$: Observable<boolean>;
  email: string;
  registerForm: FormGroup;
  errors: string[];
  partner: PartnerToUpdate;
  partnerValues: Partner;
  files: File[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  progress = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private partneriService: PartneriService,
    private accountService: AccountService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void{
    this.isAdmin$ = this.accountService.isAdmin$;
    this.email = this.route.snapshot.paramMap.get('email');
    this.createForm();
    this.partneriService.getPartner(this.email).toPromise().then((resp: Partner) => {
      this.partnerValues = resp;
      this.registerForm.get('opis').setValue(resp.opis);
      this.registerForm.get('telefon').setValue(resp.telefon);
      this.registerForm.get('fax').setValue(resp.fax);
      this.registerForm.get('adresa').setValue(resp.adresa);
      this.registerForm.get('web').setValue(resp.web);
      this.registerForm.get('facebook').setValue(resp.facebook);
      this.registerForm.get('instagram').setValue(resp.instagram);
      this.registerForm.get('tiktok').setValue(resp.tiktok);
      this.registerForm.get('youtube').setValue(resp.youtube);
      this.registerForm.get('twitter').setValue(resp.twitter);
    });
  }
  createForm(): void {
    this.registerForm = this.fb.group({
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
  onSubmit(): void {
    this.partneriService.updatePartner(this.partnerValues.id, this.registerForm.value).subscribe(resp => {
      if (this.files[0]) {
        this.uploadFile(this.files[0], this.partnerValues.id);
        this.router.navigate(['/dashboard/korisnici']);
      }
      this.router.navigate(['/dashboard/korisnici']);
    }, error => {
      console.log(error);
    });
  }
}
