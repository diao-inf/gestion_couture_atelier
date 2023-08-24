import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { filter } from 'rxjs';
import { Article } from 'src/app/shared/interfaces/article';
import { Categorie } from 'src/app/shared/interfaces/categorie';
import { Fournisseur, FournisseurImpl } from 'src/app/shared/interfaces/fournisseur';
import { ResponseApi } from 'src/app/shared/interfaces/response-api';
import { RessourceAll } from 'src/app/shared/interfaces/ressource-all';
import { SendArticle } from 'src/app/shared/interfaces/send-article';

@Component({
  selector: 'app-form-by-reactive-form',
  templateUrl: './form-by-reactive-form.component.html',
  styleUrls: ['./form-by-reactive-form.component.css']
})
export class FormByReactiveFormComponent implements OnInit, OnChanges {
  @ViewChild('msgInfo') msgInfo!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;

  selectedItems: FournisseurImpl[] = [];
  dropdownSettings!: IDropdownSettings;

  @Input() inputData!: RessourceAll;
  @Input() inputResponseArticle!: ResponseApi<Article>;
  @Input() inputResponseUpdateArticle!: ResponseApi<Article>;
  @Input() articleAEdite!: Article;
  @Output() eventEmmitter = new EventEmitter<SendArticle>();
  @Output() eventEmitterArticleSuccess = new EventEmitter<Article>();
  @Output() eventEmitterArticleUpdated = new EventEmitter<SendArticle>();
  @Output() eventEmitterArticleUpdatedSuccess = new EventEmitter<Article>();

  articleForm!: FormGroup;
  url:string | ArrayBuffer = "";
  selectedImage!: File;
  categories: Categorie[] = [];
  fournisseurs: FournisseurImpl[] = [];
  articles: Article[] = [];
  modeAjout: boolean = true
  libRef:string = "";
  catRef:string = "";
  numRef:string = "";


  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.createArticleForm();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'fullname',
      selectAllText: 'Selectionner tout',
      unSelectAllText: 'Deselectionner tout',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      
    };
  }

  ngOnChanges() {
    this.articles = this.inputData?.article;
    this.categories = this.inputData?.categorie;
    this.fournisseurs = this.inputData.fournisseur.map((fournisseur: Fournisseur) => {
      const impl = new FournisseurImpl();
      impl.id = fournisseur.id;
      impl.nom = fournisseur.nom;
      impl.prenom = fournisseur.prenom;
      impl.fullname = impl.prenom + ' ' + impl.nom;
      return impl;
    });
    

    if (this.articleAEdite) {
      this.articleForm.patchValue({
        id : this.articleAEdite.id,
        libelle: this.articleAEdite.libelle,
        prix: this.articleAEdite.prix,
        stock: this.articleAEdite.stock,
        reference: this.articleAEdite.reference,
        photo: this.articleAEdite.photo,
        categorie: this.articleAEdite.categorie_id,
        fournisseurs: this.articleAEdite.fournisseur_ids
      });
    }

    //update response
    // if(this.inputResponseUpdateArticle?.status === 200){
    //   alert("suis au message informations")
    //   this.eventEmitterArticleUpdatedSuccess.emit(this.inputResponseUpdateArticle.data);
    //   afficherMessage(this.msgInfo, this.inputResponseUpdateArticle.message, "alert-success");
      
    //   this.selectedImage = new File([], "");
    //   this.url = "";
    //   this.articleForm.reset();
    //   this.articleForm.get('reference')!.patchValue("REF-");
    //   this.selectedItems = [];
    //   this.dropdown.nativeElement=null; 
    //   return;
    // }else{
    //   if(this.inputResponseUpdateArticle?.message  === "Erreur de validation"){
    //     const tableau = Object.values(this.inputResponseUpdateArticle.errorsList!);
    //     afficherMessage(this.msgInfo, tableau[0], "alert-danger");
    //   }else{
    //     afficherMessage(this.msgInfo, this.inputResponseUpdateArticle?.message, "alert-danger");
    //   }
    //   return;
    // }

    
    // ajouter response
    if(this.inputResponseArticle?.status === 200){
      this.eventEmitterArticleSuccess.emit(this.inputResponseArticle.data);
      this.modeAjout = true
      afficherMessage(this.msgInfo, this.inputResponseArticle.message, "alert-success");
      this.selectedImage = new File([], "");
      this.url = "";
      this.articleForm.reset();
      this.articleForm.get('reference')!.patchValue("REF-");
      this.selectedItems = [];
      this.dropdown.nativeElement=null; 
      return;
    }else{
      if(this.inputResponseArticle?.message === "Erreur de validation"){
        const tableau = Object.values(this.inputResponseArticle.errorsList!);
        afficherMessage(this.msgInfo, tableau[0], "alert-danger");
      }else{
        afficherMessage(this.msgInfo, this.inputResponseArticle?.message, "alert-danger");
      }
      return;
    }
  }


  createArticleForm(): void {
    this.articleForm = this.fb.group({
      id: [0],
      libelle: ["", [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z0-9 ]*')]], // ,[this.uniqueLibelleValidator.bind(this)]
      prix: ["", [Validators.required, Validators.min(10), Validators.max(1000000)]],
      stock: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
      // reference: new FormControl("REF-"),
      reference: [{value: "REF-", disabled: true}],
      photo: [null, [Validators.required, customPhotoValidator]],
      categorie: [, [customCategoryValidator, Validators.min(1)]],
      fournisseurs: [[], Validators.compose([Validators.required, minLengthSelectedItems(1)])]
    });
  }

  OnLibelleChange(event: Event){
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = target.value.trim();
      this.libRef = (value.substring(0, 5));
      this.articleForm.patchValue({
        reference: setRefererence(this.libRef, this.catRef, this.numRef)
      })
      
    }

  }

  onSelectImg(event: Event): void {
    const selectedFile = (event.target as HTMLInputElement).files![0];

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

  onItemSelect(item: ListItem): void {
    const currentFournisseurs = this.articleForm.get('fournisseurs')!.value;
    currentFournisseurs.push(+item.id);
    this.articleForm.patchValue({
      fournisseurs:currentFournisseurs
    })
  
  }
  
  onSelectAll(items: ListItem[]): void {
    const ids: number[] = items.map(item => +item.id);
    this.articleForm.patchValue({
      fournisseurs:ids
    })
  }

  onCategoryChange(event:Event){
    const target = event.target as HTMLInputElement;
    if (target) {
      const idCategory = +target.value
      const categorie = getCategoryById(idCategory, this.categories);
      if (categorie) {
        this.catRef = categorie!.libelle;
        this.numRef = (nobrOcCategorieInArticle(idCategory, this.articles)+1).toString();
        this.articleForm.patchValue({
          reference: setRefererence(this.libRef, this.catRef, this.numRef)
        })
      }  
    }
  }

  saveData(){
    
    const article:Article = this.articleForm.value;
    article.categorie_id = +this.articleForm.get('categorie')!.value;
    article.fournisseur_ids = this.articleForm.get('fournisseurs')!.value;
    article.reference = this.articleForm.get('reference')!.value;
    if(this.selectedImage) {
      const sendArticle:SendArticle = {"article":article, "img":this.selectedImage}
      if(this.modeAjout) this.eventEmmitter.emit(sendArticle);
      else this.eventEmitterArticleUpdated.emit(sendArticle);
    };
  }

  uniqueLibelleValidator(control: AbstractControl): ValidationErrors | null {
    const libelle = control.value;
    for (const article of this.articles) {
      if (article.libelle === libelle) {
        // alert(article.libelle)
        return { uniqueLibelle: true };
      }
    }
    return null;
  }

//   updateForm(libelle: string, prix: number, ){
//     this.articleForm.setValue({
//       id: article.id,
//       libelle: article.libelle,
//       prix: article.prix,
//       stock: article.prix,
//       reference: article.reference,
//       categorie:article.categorie_id,
//       photo: article.photo,
//       fournisseurs: article.fournisseur_ids
//     })
//   }


}


function customCategoryValidator(control: FormControl) {
  const value = control.value;
  if (value === null || value === "" || value === undefined || value === "***** Veuillez Selectionner *****") {
    return { required: true, categoryValue: true };
  }
  return null;
}


function customPhotoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  if (!value) {
    return { required: true };
  }

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = value.split('.').pop()?.toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return { invalidFormat: true };
  }

  return null;
}

function  setRefererence(libRef:string, categoryRef:string, numRef:string){

  return ("REF-" + (libRef ?? "") + "-" + (categoryRef ?? "") + "-" + (numRef ?? "")).toUpperCase();
}

function  minLengthSelectedItems(min: number) {
  return (control: any): { [key: string]: any } | null => {
    const selectedItems = control.value;
    return selectedItems.length >= min ? null : { minLengthSelectedItems: true };
  };
}

function  nobrOcCategorieInArticle(val:number, articles:Article[]): number{
  let count = 0;
  for (const iterator of articles) {
    if(iterator.categorie_id === val) count++;
  }
  return count;
}

function getCategoryById(id:number, categories:Categorie[]): Categorie|undefined{
  for (const iterator of categories) {
    if (iterator.id === id) return iterator;
  }
  return undefined;
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


