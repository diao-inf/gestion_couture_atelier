import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { GestionAtelierCoutureComponent } from './gestion-atelier-couture/gestion-atelier-couture.component';
import { ArticleComponent } from './article/article.component';
import { FormComponent } from './article/form/form.component';
import { ListeComponent } from './article/liste/liste.component';
import { ItemComponent } from './article/liste/item/item.component';
import { PaginationComponent } from './shared/composants_public/pagination/pagination.component';
import { FormByReactiveFormComponent } from './article/form-by-reactive-form/form-by-reactive-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    GestionAtelierCoutureComponent,
    ArticleComponent,
    // FormComponent,
    ListeComponent,
    ItemComponent,
    PaginationComponent,
    FormByReactiveFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
