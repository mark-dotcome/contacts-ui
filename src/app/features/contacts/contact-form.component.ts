import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContactsService, Contact } from '../../core/services/contacts.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnInit {
  contact: Contact = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    app: 'contacts-app'
  };

  isEditMode = false;
  isLoading = false;
  contactId: string | null = null;

  states = [
    { name: 'Alabama', code: 'AL' },
    { name: 'California', code: 'CA' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Massachusetts', code: 'MA' },
    { name: 'New York', code: 'NY' },
    { name: 'Texas', code: 'TX' },
    { name: 'Washington', code: 'WA' }
  ];

  apps = ['contacts-app', 'crm-app', 'sales-app'];

  constructor(
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id');
    if (this.contactId && this.contactId !== 'new') {
      this.isEditMode = true;
      this.loadContact();
    }
  }

  loadContact(): void {
    if (!this.contactId) return;
    
    this.contactsService.getContact(this.contactId).subscribe({
      next: (contact) => {
        this.contact = contact;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contact'
        });
        this.router.navigate(['/contacts']);
      }
    });
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    this.isLoading = true;

    const operation = this.isEditMode && this.contactId
      ? this.contactsService.updateContact(this.contactId, this.contact)
      : this.contactsService.createContact(this.contact);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditMode ? 'Contact updated successfully' : 'Contact created successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/contacts']);
        }, 1000);
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditMode ? 'Failed to update contact' : 'Failed to create contact'
        });
      }
    });
  }

  isValid(): boolean {
    return !!(
      this.contact.firstName &&
      this.contact.lastName &&
      this.contact.email &&
      this.contact.phone &&
      this.contact.address.street &&
      this.contact.address.city &&
      this.contact.address.state &&
      this.contact.address.zip &&
      this.contact.app
    );
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  }
}
