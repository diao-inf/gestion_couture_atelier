import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Fournisseur } from '../interfaces/fournisseur';

@Injectable({
  providedIn: 'root'
})
export class FournisseurServiceService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseApi<Fournisseur[]>> {
    const apiUrl = `http://localhost:8000/api/fournisseurs`;
    return this.http.get<ResponseApi<Fournisseur[]>>(apiUrl);
  }
}
