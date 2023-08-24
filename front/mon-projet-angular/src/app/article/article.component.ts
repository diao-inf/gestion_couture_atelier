import { Component, OnInit } from '@angular/core';
import { RessourceAllService } from '../shared/services/ressource-all.service';
import { RessourceAll } from '../shared/interfaces/ressource-all';
import { ResponseApi } from '../shared/interfaces/response-api';
import { Form } from '@angular/forms';
import { Article } from '../shared/interfaces/article';
import { AriticleService } from '../shared/services/ariticle.service';
import { SendArticle } from '../shared/interfaces/send-article';
import { FormComponent } from './form/form.component';
import { FormByReactiveFormComponent } from './form-by-reactive-form/form-by-reactive-form.component';
import { ListeComponent } from './liste/liste.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent{
  allData!:RessourceAll;
  responseArticle!:ResponseApi<Article>;
  responseUpdateArticle!:ResponseApi<Article>;
  responseArticleDeleted!:ResponseApi<Article>;
  articleEdite!: Article;
  articleDeleted!: Article;
  articleInsertSuccess!: Article;


  constructor(private ressourceService: RessourceAllService, private serviceArticle: AriticleService){}

  ngOnInit(){
    this.ressourceService.getAll().subscribe((response:ResponseApi<RessourceAll>) => {
      if(response.status === 200) {
        this.allData = response.data;
      }
      },
      (error) => {
        console.error('Une erreur s\'est produite :', error);
      }
    );
  }

  receiveObject(sendArticle: SendArticle) {
    
    this.serviceArticle.add(sendArticle.article, sendArticle.img).subscribe({
      next: 
      (response:ResponseApi<Article>) => {
        this.responseArticle = response;
      },
      error: (err: Error) => console.error('Une erreur s\'est produite : ' + err),
      complete: () => console.log('Observer got a complete notificationcool tout ok+++++++++++++++'),
    });
  }

  receiveArticleUpdated(sendArticle: SendArticle) {
    this.serviceArticle.update(sendArticle.article, sendArticle.img).subscribe({
      next: (response:ResponseApi<Article>) => {
        // this.responseUpdateArticle = response;
        alert(1234567890)
        this.responseArticle = response;
        console.log("------------------------- fin update ----------------------------");

      },
      error: (err: Error) => console.error('Une erreur s\'est produite : ' + err),
      complete: () => console.log('Observer got a complete notificationcool tout ok+++++++++++++++'),
    });
    
  }

  recevoirArticleEditeInArticleComponent(article: Article,forme:FormByReactiveFormComponent) {
    this.articleEdite = article;
    // forme.selectedItems.push(forme.fournisseurs[0])
    forme.modeAjout = false
    forme.url =  getFullImageUrl(article.photo!);
    
    forme.articleForm.patchValue({
      categorie:article.categorie_id,
      
    })
    forme.articleForm.patchValue(article);
    console.log("------------------------ RECEVOIR ARTCILE A EDITE --------------------",forme.articleForm);
    // forme.url = getFullImageUrl(article.photo!)
  }

  recevoirArticleDeleteInArticleComponent(article: Article){
    this.articleDeleted = article;
    this.serviceArticle.deleteArticle(article.id!).subscribe({
      next: 
      (response:ResponseApi<Article>) => {
        this.responseArticleDeleted = response;
      },
      error: (err: Error) => console.error('Une erreur s\'est produite : ' + err),
      complete: () => console.log('Observer got a complete notificationcool tout ok'),
    });
  }

  receiveArticleSuccess(article: Article,liste:ListeComponent){
    this.articleInsertSuccess = article;
    // liste.articles.pop();
    liste.articles.unshift(article);
    console.log("---------------------Insert SUCCE SUIS ARtice-------------------------------", this.articleInsertSuccess);
    
  }

  receiveArticleUpdatedSuccess(article: Article,liste:ListeComponent){
    alert("sénégalalalalalalalalalalalalalal")
    liste.articles = liste.articles.map(item => {
      if (item.id === article.id) {
        return article;
      }
      return item;
    });
  }

  receiveArticleDeleteSuccess(article: Article,liste:ListeComponent){
    liste.articles = liste.articles.filter(item => item.id !== article.id);
  }

}

function getFullImageUrl(relativePath: string): string {
  if (relativePath) {
    return `http://localhost:8000${relativePath}`;
  }
  return '';
}

