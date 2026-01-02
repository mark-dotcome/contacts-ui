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
  template: `
    <p-toast></p-toast>
    
    <div class="p-4">
      <div class="mb-4">
        <a routerLink="/contacts" class="text-primary no-underline">
          <i class="pi pi-arrow-left mr-2"></i>Back to Contacts
        </a>
      </div>

      <p-card>
        <ng-template pTemplate="header">
          <div class="p-4 pb-0">
            <h2 class="text-2xl font-bold text-900 m-0">
              {{ isEditMode ? 'Edit Contact' : 'Create New Contact' }}
            </h2>
            <p class="text-600 mt-1">
              {{ isEditMode ? 'Update contact information' : 'Add a new contact to your list' }}
            </p>
          </div>
        </ng-template>

        <form (ngSubmit)="onSubmit()">
          <h3 class="text-lg font-semibold text-900 mb-3">
            <i class="pi pi-user mr-2"></i>Personal Information
          </h3>
          
          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="firstName" class="block text-900 font-medium mb-2">First Name *</label>
              <input 
                id="firstName" 
                type="text" 
                pInputText 
                [(ngModel)]="contact.firstName" 
                name="firstName"
                class="w-full" 
                placeholder="Enter first name"
                required
              />
            </div>
            <div class="col-12 md:col-6">
              <label for="lastName" class="block text-900 font-medium mb-2">Last Name *</label>
              <input 
                id="lastName" 
                type="text" 
                pInputText 
                [(ngModel)]="contact.lastName" 
                name="lastName"
                class="w-full" 
                placeholder="Enter last name"
                required
              />
            </div>
            <div class="col-12 md:col-6">
              <label for="email" class="block text-900 font-medium mb-2">Email Address *</label>
              <input 
                id="email" 
                type="email" 
                pInputText 
                [(ngModel)]="contact.email" 
                name="email"
                class="w-full" 
                placeholder="Enter email address"
                required
              />
            </div>
            <div class="col-12 md:col-6">
              <label for="phone" class="block text-900 font-medium mb-2">Phone Number *</label>
              <input 
                id="phone" 
                type="tel" 
                pInputText 
                [(ngModel)]="contact.phone" 
                name="phone"
                class="w-full" 
                placeholder="(555) 000-0000"
                required
              />
            </div>
          </div>

          <h3 class="text-lg font-semibold text-900 mb-3 mt-4">
            <i class="pi pi-map-marker mr-2"></i>Address Information
          </h3>

          <div class="grid">
            <div class="col-12">
              <label for="street" class="block text-900 font-medium mb-2">Street Address *</label>
              <input 
                id="street" 
                type="text" 
                pInputText 
                [(ngModel)]="contact.address.street" 
                name="street"
                class="w-full" 
                placeholder="Enter street address"
                required
              />
            </div>
            <div class="col-12 md:col-6">
              <label for="city" class="block text-900 font-medium mb-2">City *</label>
              <input 
                id="city" 
                type="text" 
                pInputText 
                [(ngModel)]="contact.address.city" 
                name="city"
                class="w-full" 
                placeholder="Enter city"
                required
              />
            </div>
            <div class="col-12 md:col-3">
              <label for="state" class="block text-900 font-medium mb-2">State *</label>
              <p-select 
                id="state"
                [(ngModel)]="contact.address.state" 
                name="state"
                [options]="states" 
                optionLabel="name"
                optionValue="code"
                placeholder="Select state"
                styleClass="w-full"
              ></p-select>
            </div>
            <div class="col-12 md:col-3">
              <label for="zip" class="block text-900 font-medium mb-2">ZIP Code *</label>
              <input 
                id="zip" 
                type="text" 
                pInputText 
                [(ngModel)]="contact.address.zip" 
                name="zip"
                class="w-full" 
                placeholder="Enter ZIP code"
                required
              />
            </div>
          </div>

          <div class="grid mt-4">
            <div class="col-12 md:col-6">
              <label for="app" class="block text-900 font-medium mb-2">Application *</label>
              <p-select 
                id="app"
                [(ngModel)]="contact.app" 
                name="app"
                [options]="apps" 
                placeholder="Select application"
                styleClass="w-full"
              ></p-select>
            </div>
          </div>

          @if (isEditMode && contact.createdBy) {
            <div class="surface-100 border-round p-3 mt-4">
              <div class="grid">
                <div class="col-12 md:col-6">
                  <div class="text-600 text-sm">Created by:</div>
                  <div class="font-medium">{{ contact.createdBy }}</div>
                  <div class="text-600 text-sm mt-2">Created on:</div>
                  <div class="font-medium">{{ formatDate(contact.createdDt) }}</div>
                </div>
                <div class="col-12 md:col-6">
                  <div class="text-600 text-sm">Last modified by:</div>
                  <div class="font-medium">{{ contact.modifiedBy }}</div>
                  <div class="text-600 text-sm mt-2">Last modified on:</div>
                  <div class="font-medium">{{ formatDate(contact.modifiedDt) }}</div>
                </div>
              </div>
            </div>
          }

          <div class="flex justify-content-end gap-2 mt-4">
            <p-button 
              label="Cancel" 
              icon="pi pi-times" 
              severity="secondary"
              [outlined]="true"
              routerLink="/contacts"
            ></p-button>
            <p-button 
              type="submit"
              [label]="isEditMode ? 'Save Changes' : 'Create Contact'" 
              [icon]="isEditMode ? 'pi pi-check' : 'pi pi-plus'"
              [loading]="isLoading"
            ></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `
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
