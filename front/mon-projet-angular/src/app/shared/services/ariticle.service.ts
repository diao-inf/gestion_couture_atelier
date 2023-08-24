import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Article } from '../interfaces/article';

@Injectable({
  providedIn: 'root'
})
export class AriticleService {

  constructor(private http:HttpClient) { }

  getAll(): Observable<ResponseApi<Article[]>> {
    const apiUrl = `http://localhost:8000/api/categories`;
    return this.http.get<ResponseApi<Article[]>>(apiUrl);
  }

  add(article: Article, image: File): Observable<ResponseApi<Article>> {
    const apiUrl = `http://localhost:8000/api/articles`;

    const formData = new FormData();
    formData.append('libelle', article.libelle);
    formData.append('prix', article.prix.toString());
    formData.append('stock', article.stock.toString());
    formData.append('reference', article.reference);
    formData.append('categorie_id', article.categorie_id.toString());
    formData.append('fournisseur_ids', article.fournisseur_ids!.map(number => number.toString()).join(',')); 
    // formData.append('fournisseur_ids', article.fournisseur_ids?[0]); 
  
    if (image) {
      formData.append('photo', image);
    }

    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data'
    // });
    
    return this.http.post<ResponseApi<Article>>(apiUrl, formData);
  }

  update(article: Article, image: File | null): Observable<ResponseApi<Article>> {
    console.log("------------------------- commencement update ----------------------------");
    alert(article.fournisseur_ids)
    const apiUrl = `http://localhost:8000/api/articles/${article.id}`;
    const formData = new FormData();
    formData.append('libelle', article.libelle);
    formData.append('prix', article.prix.toString());
    formData.append('stock', article.stock.toString());
    formData.append('reference', article.reference);
    formData.append('categorie_id', article.categorie_id.toString());
    formData.append('fournisseur_ids', article.fournisseur_ids!.map(number => number.toString()).join(',')); 
    formData.append('_method', 'PUT');
    
    if (image) {
      formData.append('photo', image);
    }

    return this.http.post<ResponseApi<Article>>(apiUrl, formData);
  }
  
  deleteArticle(articleId: number): Observable<ResponseApi<Article>> {
    const apiUrl = `http://localhost:8000/api/articles/${articleId}`; 
    return this.http.delete<ResponseApi<Article>>(apiUrl);
  }
  


}
