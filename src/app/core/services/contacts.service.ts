import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Contact {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  app: string;
  createdBy?: string;
  createdDt?: string;
  modifiedBy?: string;
  modifiedDt?: string;
}

export interface SearchResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/`);
  }

  searchContacts(
    query?: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'lastName',
    order: string = 'asc'
  ): Observable<SearchResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort_by', sortBy)
      .set('order', order);

    if (query) {
      params = params.set('q', query);
    }

    return this.http.get<SearchResponse>(`${this.apiUrl}/search`, { params });
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/`, contact);
  }

  updateContact(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
