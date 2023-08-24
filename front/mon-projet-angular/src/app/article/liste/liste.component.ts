import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Article } from 'src/app/shared/interfaces/article';
import { ResponseApi } from 'src/app/shared/interfaces/response-api';
import { RessourceAll } from 'src/app/shared/interfaces/ressource-all';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent implements OnInit, OnChanges {
  @ViewChild('msgInfo') msgInfo!: ElementRef;

  articles!:Article[];

  @Input() inputData!: RessourceAll;
  @Input() inputResponseArticleDeleted!: ResponseApi<Article>;
  @Output() editArticleEvent = new EventEmitter<Article>();
  @Output() deleteArticleEvent = new EventEmitter<Article>();
  @Output() eventEmitterArticleDeleteSuccess = new EventEmitter<Article>();



  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.articles = this.inputData.article;
    // this.loadArticles();

     //Delete response
     if(this.inputResponseArticleDeleted?.status === 200){
      console.log("===========================cas success==================================", this.inputResponseArticleDeleted);
      
      afficherMessage(this.msgInfo, this.inputResponseArticleDeleted?.message, "alert-success");
      this.eventEmitterArticleDeleteSuccess.emit(this.inputResponseArticleDeleted.data);
      return;
    }else{
      console.log("===========================cas echec==================================", this.inputResponseArticleDeleted);
      afficherMessage(this.msgInfo, this.inputResponseArticleDeleted?.message, "alert-danger");
      return;
    }

  }

  recevoirArticleEdite(article: Article): void {
    this.editArticleEvent.emit(article);
    console.log("+++++++++++++++++EDIT IN LIST+++++++++++++++", article);
    
  }

  recevoirArticleDelete(article: Article){
    this.deleteArticleEvent.emit(article);
    console.log("+++++++++++++++++DELETE IN LIST+++++++++++++++", article);
  }

  // recevoirArticleInsertSuccess(ariticle: Article){

  // }

  private loadArticles(): void {
    if (this.inputData && this.inputData.article) {
      this.articles = this.inputData.article;
    }
  }

}

function afficherMessage(viewChild: ElementRef, texte: string, classe: string): void {
  const element: HTMLElement | null = viewChild?.nativeElement;
  if (element) {
    viewChild.nativeElement.style.display = 'block';
    viewChild.nativeElement.classList.add(classe);
    element.innerHTML = `<marquee loop="1" behavior="slide" scrollamount="150" direction="left">${texte}</marquee>`;
    setTimeout(() => {
      viewChild.nativeElement.style.display = 'none';
      viewChild.nativeElement.classList.remove(classe);
      element.innerHTML = '';
    }, 5000);
  }
}
