import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CategorieServicesService } from '../../shared/services/categorie-services.service';
import { Categorie } from '../../shared/interfaces/categorie';
import { FournisseurServiceService } from '../../shared/services/fournisseur-service.service';
import { Fournisseur } from '../../shared/interfaces/fournisseur';
import { Article } from '../../shared/interfaces/article';
import { RessourceAll } from 'src/app/shared/interfaces/ressource-all';
import { SendArticle } from 'src/app/shared/interfaces/send-article';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnChanges{
  @Input() inputData!: RessourceAll;
  @Output() eventEmmitter = new EventEmitter<SendArticle>();
  url:string | ArrayBuffer = "";
  selectedImage!: File;
  categories!: Categorie[];
  fournisseurs!: Fournisseur[];
  selectedSuggestion!: Fournisseur;
  suggestions!: Fournisseur[];
  article: Article = {libelle: "",prix: 0,stock: 0,reference: "",photo: "",categorie_id: 0, categorie_libelle: "",};
  articles: Article[] = [];
  fournisseurChoisiEnChaine!:string;
  valueSuggestion!:string;
  reference!:string;
  libRef!:string;
  categoryRef!:string;
  numRef!:number;

  

  constructor() { }

  ngOnChanges() {
    this.categories = this.inputData.categorie;
    this.fournisseurs = this.inputData.fournisseur;
  }

  selectSuggestion(suggestion: Fournisseur) {
    this.valueSuggestion = suggestion.prenom+' '+suggestion.nom;
    
    if(this.fournisseurChoisiEnChaine===""||this.fournisseurChoisiEnChaine === undefined){
      this.fournisseurChoisiEnChaine = this.valueSuggestion+",";
    }
    else if(this.fournisseurChoisiEnChaine.includes(this.valueSuggestion)){
      this.fournisseurChoisiEnChaine.replace(this.valueSuggestion, this.valueSuggestion.trim()+",");
    }
    else {
      this.fournisseurChoisiEnChaine = this.fournisseurChoisiEnChaine+this.valueSuggestion.trim()+","
    }
    this.suggestions = [];
  }

  onFournisseurInputChange(event: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    const arrayResultInput = inputValue.split(',');
    const lasInputValue = this.extractGroupString(inputValue, ',');
    if (lasInputValue) {
      this.suggestions = this.fournisseurs.filter(fournisseur =>
        (fournisseur.prenom.toLowerCase().includes(lasInputValue.toLowerCase()) ||
        fournisseur.nom.toLowerCase().includes(lasInputValue.toLowerCase())) ||
        ((fournisseur.prenom.toLowerCase() == inputValue.split(' ')[0].toLowerCase()) &&
        fournisseur.nom.toLowerCase().includes(inputValue.split(' ')[1].toLowerCase()))
      );
      this.suggestions = this.suggestions.filter(suggestion => !arrayResultInput.includes(suggestion.prenom+' '+suggestion.nom));
    } else {
      this.suggestions = []; 
    }
  }

  onChangeLibele(event:Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = target.value.trim();
      this.article.libelle = value;
      this.libRef = (value.substring(0, 5)).toUpperCase();
      this.setRefererence();
    }
  
  }

  onChangePrix(event:Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.article.prix = +target.value;

    }
  
  }

  onChangeStock(event:Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.article.stock = +target.value;
    }
  
  }

  onCategoryChange(event:Event){
    const target = event.target as HTMLInputElement;
    if (target) {
      const categorie = this.getCategoryById(+target.value);
      if (categorie) {
        const id:number = categorie.id !== undefined ? categorie.id : 0;
        this.article.categorie_id = id;
        this.categoryRef = categorie!.libelle.toUpperCase();
        this.numRef = this.nobrOcCategorieInArticle(+!categorie?.id, this.articles)+1;
        this.setRefererence();
      }
      
    }
  }

  setRefererence(){

    this.reference = "REF-" + (this.libRef ?? "") + "-" + (this.categoryRef ?? "") + "-" + (this.numRef ?? "");
  }

  getCategoryById(id:number): Categorie|undefined{
    for (const iterator of this.categories) {
      if (iterator.id === id) return iterator;
    }
    return undefined;
  }

  nobrOcCategorieInArticle(val:number, articles:Article[]): number{
    let count = 0;
    for (const iterator of articles) {
      if(iterator.categorie_id === val) count++;
    }
    return count;
  }

  onSend(){
    const tabString = this.fournisseurChoisiEnChaine.split(',')
    tabString.pop();
    let fournisseurs:Fournisseur[] = [];
    let ids:number[] = [];
    
    for (const iterator of tabString) {
      const nom = this.extractGroupString(iterator,' ');
      const prenom = this.getFirstName(iterator, nom);
      const fournisseur:Fournisseur = {nom,prenom}
      const id = this.getIdFournisseur(fournisseur);
      if(id === undefined){
        alert("champ non valider");
        return;
      }
      fournisseur.id = id;
      ids.push(id);
      fournisseurs.push(fournisseur);
    }
    this.article.reference = this.reference;
    this.article.fournisseur_ids = ids;
    console.log(this.article);
    if(this.selectedImage) this.eventEmmitter.emit({"article":this.article, "img":this.selectedImage});
    
    // this.article.categorie_id = 
    // alert(123);
  }

  extractGroupString(input: string,coupBy:string): string {
    const lastCommaIndex = input.lastIndexOf(coupBy);
    if (lastCommaIndex !== -1) {
      return input.substr(lastCommaIndex + 1).trim();
    }
    return input.trim();
  }

  getFirstName(chaine:string, nom:string) {
    const nameIndex = chaine.indexOf(nom);
    let firstName =""
    if (nameIndex !== -1) firstName = chaine.slice(0,nameIndex);
      return firstName.trim();
  }

  getIdFournisseur(fournisseur:Fournisseur):number|undefined{
    for (const iterator of this.fournisseurs) {
      if(iterator.prenom === fournisseur.prenom && iterator.nom === fournisseur.nom){
        return iterator.id;
      }
    }
    return undefined;
  }
 



 
  onSelectImg(event: Event): void {
    const selectedFile = (event.target as HTMLInputElement).files?.[0] || null;

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      this.selectedImage = selectedFile;

      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e: any) => {
        this.url = e.target.result;
      };
    } else {
      alert('Choix incorrect');
    }
  }
  
}
