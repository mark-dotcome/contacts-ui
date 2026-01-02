import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactsService, Contact } from '../../core/services/contacts.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <div class="p-2 md:p-4">
      <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-4 gap-3">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-900 m-0">Contacts</h1>
          <p class="text-600 mt-1">Manage your contact list</p>
        </div>
        <p-button 
          label="Add Contact" 
          icon="pi pi-plus" 
          (onClick)="navigateToCreate()"
          class="w-full md:w-auto"
        ></p-button>
      </div>

      <p-card>
        <div class="flex gap-3 mb-4">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search"></i>
            <input 
              type="text" 
              pInputText 
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Search contacts..." 
              class="w-full"
            />
          </span>
        </div>

        <p-table 
          [value]="contacts" 
          [paginator]="true" 
          [rows]="10"
          [totalRecords]="totalRecords"
          [lazy]="true"
          (onLazyLoad)="loadContacts($event)"
          [loading]="loading"
          [rowHover]="true"
          styleClass="p-datatable-sm"
          responsiveLayout="scroll"
          [breakpoint]="'768px'"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="lastName">Name <p-sortIcon field="lastName"></p-sortIcon></th>
              <th>Phone</th>
              <th>Address</th>
              <th>App</th>
              <th>Modified</th>
              <th style="width: 150px">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-contact>
            <tr>
              <td>
                <div class="flex align-items-center gap-2">
                  <div class="flex align-items-center justify-content-center bg-primary border-circle" style="width: 40px; height: 40px;">
                    <span class="text-white font-bold">{{ getInitials(contact) }}</span>
                  </div>
                  <div>
                    <div class="font-bold">{{ contact.firstName }} {{ contact.lastName }}</div>
                    <div class="text-600 text-sm">{{ contact.email }}</div>
                  </div>
                </div>
              </td>
              <td>{{ contact.phone }}</td>
              <td>{{ formatAddress(contact.address) }}</td>
              <td><p-tag [value]="contact.app" severity="info"></p-tag></td>
              <td>{{ formatDate(contact.modifiedDt) }}</td>
              <td>
                <div class="flex gap-2">
                  <p-button 
                    icon="pi pi-eye" 
                    [rounded]="true" 
                    [text]="true"
                    (onClick)="viewContact(contact)"
                  ></p-button>
                  <p-button 
                    icon="pi pi-pencil" 
                    [rounded]="true" 
                    [text]="true"
                    (onClick)="editContact(contact)"
                  ></p-button>
                  <p-button 
                    icon="pi pi-trash" 
                    [rounded]="true" 
                    [text]="true"
                    severity="danger"
                    (onClick)="confirmDelete(contact)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center p-4">
                <i class="pi pi-inbox text-4xl text-400 mb-3"></i>
                <p class="text-600">No contacts found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  totalRecords = 0;
  loading = false;
  searchQuery = '';
  private searchTimeout: any;

  constructor(
    private contactsService: ContactsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadContacts({ first: 0, rows: 10 });
  }

  loadContacts(event: any): void {
    this.loading = true;
    const page = Math.floor(event.first / event.rows) + 1;
    const sortField = event.sortField || 'lastName';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.contactsService.searchContacts(
      this.searchQuery || undefined,
      page,
      event.rows,
      sortField,
      sortOrder
    ).subscribe({
      next: (response) => {
        this.contacts = response.contacts;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contacts'
        });
      }
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadContacts({ first: 0, rows: 10 });
    }, 300);
  }

  navigateToCreate(): void {
    this.router.navigate(['/contacts/new']);
  }

  viewContact(contact: Contact): void {
    this.router.navigate(['/contacts', contact._id]);
  }

  editContact(contact: Contact): void {
    this.router.navigate(['/contacts', contact._id, 'edit']);
  }

  confirmDelete(contact: Contact): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
      header: 'Delete Contact',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteContact(contact);
      }
    });
  }

  deleteContact(contact: Contact): void {
    if (!contact._id) return;
    
    this.contactsService.deleteContact(contact._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Contact deleted successfully'
        });
        this.loadContacts({ first: 0, rows: 10 });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete contact'
        });
      }
    });
  }

  getInitials(contact: Contact): string {
    return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  }

  formatAddress(address: any): string {
    if (!address) return '';
    return `${address.street}, ${address.city}, ${address.state}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  }
}
