import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RessourceAll } from '../interfaces/ressource-all';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class RessourceAllService {

  constructor(private http:HttpClient) { }


  getAll(): Observable<ResponseApi<RessourceAll>> {
    const apiUrl = `http://localhost:8000/api/services`;
    return this.http.get<ResponseApi<RessourceAll>>(apiUrl);
  }
}
