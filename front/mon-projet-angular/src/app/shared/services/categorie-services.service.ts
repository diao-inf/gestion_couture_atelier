import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Categorie } from '../interfaces/categorie';

@Injectable({
  providedIn: 'root'
})
export class CategorieServicesService {
  // currentPage: number = 1;
  // totalElements: number = 0;
  // totalPages: number = 0;
  // nbrCategoryPage: number = 3;
  // pages: number[] = []; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseApi<Categorie[]>> {
    const apiUrl = `http://localhost:8000/api/categories`;
    return this.http.get<ResponseApi<Categorie[]>>(apiUrl);
  }
}
