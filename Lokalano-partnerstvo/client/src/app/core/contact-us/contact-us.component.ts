import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Contact } from 'src/app/shared/models/contact';
import { Kurs } from 'src/app/shared/models/kurs';
import { KursParams } from 'src/app/shared/models/kursParams';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contact: Contact = {
    name: '',
    mail: '',
    subject: '',
    message: ''
  };
  constructor(private contactService: ContactService,
              private router: Router,
              private cds: ConfirmationDialogService,
              private kursService: KurseviService) { }

  ngOnInit(): void {
  }
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      console.log(form.invalid);
    } else {
      this.contactService.getMessage(this.contact).subscribe(res => {
      this.cds.alert('Poruka', 'Poruka je uspješno poslana.', 'Uredu');
    }, err => {
      console.log(err);
    });
    }
  }
}
