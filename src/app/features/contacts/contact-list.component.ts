import { Component } from '@angular/core';
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
  templateUrl: './contact-list.component.html'
})
export class ContactListComponent {
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
