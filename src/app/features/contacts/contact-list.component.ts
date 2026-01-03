import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
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
    InputGroupModule,
    InputGroupAddonModule,
    CardModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './contact-list.component.html'
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  totalRecords = 0;
  loading = false;
  searchQuery = '';
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private currentEvent: any = { first: 0, rows: 10 };

  constructor(
    private contactsService: ContactsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.loading = true;
        this.searchQuery = query;
        const page = Math.floor(this.currentEvent.first / this.currentEvent.rows) + 1;
        const sortField = this.currentEvent.sortField || 'lastName';
        const sortOrder = this.currentEvent.sortOrder === 1 ? 'asc' : 'desc';
        return this.contactsService.searchContacts(
          query || undefined,
          1,
          this.currentEvent.rows,
          sortField,
          sortOrder
        );
      })
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

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  loadContacts(event: any): void {
    this.loading = true;
    this.currentEvent = event;
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
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
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
