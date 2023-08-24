import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Categorie, CategoriePaginate } from "../shared/interfaces/categorie";
import { ResponseApi } from "../shared/interfaces/response-api";


@Component({
    selector: 'app-gestion-atelier-couture',
    templateUrl: './gestion-atelier-couture.component.html',
    styleUrls: ['./gestion-atelier-couture.component.css'],
})
export class GestionAtelierCoutureComponent implements OnInit{
    categories: Categorie[] = [];
    categoryUpdate: Categorie | null = null;
    currentPage: number = 1;
    totalElements: number = 0;
    totalPages: number = 0;
    nbrCategoryPage: number = 3;
    pages: number[] = []; 

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.fetchCategories();

        const toggleAdd = document.querySelector('#toggleAdd') as HTMLInputElement;
        const coloredDiv = document.getElementById('coloredDivTitle') as HTMLDivElement;
        const titleText = document.getElementById('title-text') as HTMLElement;
        const bgToggGrup = document.getElementById('bgToggGrup') as HTMLElement;
        const editerText = document.getElementById('editer-text') as HTMLElement;
        const ajouterText = document.querySelector("#ajouter-text") as HTMLElement;

        const btnAddCategorie = document.getElementById('btn-add-categorie') as HTMLButtonElement
        const categoryLabel = document.getElementById('categoryLabel') as HTMLInputElement;

        const btnNbrCategoryParPage = document.getElementById('nbrCategoryParPage') as HTMLButtonElement;

        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        const btnSupprimerCheckbox = document.getElementById('btn-supprimer-checkbox') as HTMLButtonElement

        
        
        if (toggleAdd && coloredDiv) {
          toggleAdd.addEventListener('change', () => {
            const libelleLignes = document.querySelectorAll('.libelleLigne') as NodeListOf<HTMLDivElement>;
            categoryLabel.value = '';
            btnAddCategorie.disabled = true;

            if (toggleAdd.checked) {
            //   coloredDiv.style.backgroundColor = ''
              coloredDiv.classList.add('bg-primary');
              coloredDiv.classList.remove('border', 'border-primary' ,'border-2');
              titleText.classList.remove('text-primary');
              titleText.classList.add('text-white');
              bgToggGrup.classList.remove('bg-primary', "text-white");
              bgToggGrup.classList.add("bg-light", "text-primary");
              ajouterText.classList.remove("text-decoration-underline");
              editerText.classList.add("text-decoration-underline");
              categoryLabel.disabled = true;
              if(this.unAuMoinsSelectionner()) btnSupprimerCheckbox.disabled = false;
              for (const libelle of libelleLignes) {
                  libelle.classList.add("cliquable")
              }
            } else {
                // coloredDiv.style.backgroundColor = 'rgb(181, 181, 181)'
                coloredDiv.classList.remove('bg-primary');
                coloredDiv.classList.add('border', 'border-primary' ,'border-2');
                titleText.classList.remove('text-white');
                titleText.classList.add('text-primary');
                bgToggGrup.classList.remove("bg-light", "text-primary");
                bgToggGrup.classList.add('bg-primary', "text-white");
                ajouterText.classList.add("text-decoration-underline");
                editerText.classList.remove("text-decoration-underline");
                categoryLabel.disabled = false;
                btnSupprimerCheckbox.disabled = true;
                for (const libelle of libelleLignes) {
                    libelle.classList.remove("cliquable")
                }
            }
          });
        }

        selectAllCheckbox.addEventListener('change', function() {
            if(toggleAdd.checked && btnSupprimerCheckbox.disabled){
                btnSupprimerCheckbox.disabled = false;
            }else{
                btnSupprimerCheckbox.disabled = true;
            }
            const categoryCheckboxes = document.querySelectorAll('.categoryCheckbox') as NodeListOf<HTMLInputElement>;

            for (const checkbox of categoryCheckboxes) {
                checkbox.checked = this.checked;
            }
        });

        btnSupprimerCheckbox.addEventListener('click', ()=>{
            btnSupprimerCheckbox.disabled = true;
            selectAllCheckbox.checked = false;
            const categoryCheckboxes = document.querySelectorAll('.categoryCheckbox') as NodeListOf<HTMLInputElement>;
            
            const ids: number[] = [];
            categoryCheckboxes.forEach(checkbox => {
                if(checkbox.checked){
                    checkbox.checked = false;
                    ids.push(+checkbox.getAttribute('idValue')!);
                }
            });

            if (ids.length > 0) {
                const nbrCategoryLastPage = Math.abs(this.totalElements - (--this.totalPages*this.nbrCategoryPage));
                if(ids.length === nbrCategoryLastPage){
                    this.currentPage = 1;
                }
                this.fetchDeletesCategories(ids);
            }
        })  

        btnNbrCategoryParPage.addEventListener('click', () =>{
            selectAllCheckbox.checked = false;
            const nbCategoryLabel = document.getElementById('nbCategoryLabel') as HTMLInputElement;
            this.nbrCategoryPage = +nbCategoryLabel.value;
            this.currentPage = 1;
            this.fetchCategories();
        });

        categoryLabel.addEventListener('input', () =>{
            if(categoryLabel.value.length >= 3){
                if(!this.asCategory(categoryLabel.value.trim())){
                    btnAddCategorie.disabled = false;
                }else{
                    btnAddCategorie.disabled = true;
                }
                
            }else{
                btnAddCategorie.disabled = true;
                if(categoryLabel.value.length === 0) categoryLabel.disabled = true;
            }
        });

        btnAddCategorie.addEventListener('click', () => {
            const valueEnter:string = categoryLabel.value;
            categoryLabel.value = "";
            btnAddCategorie.disabled = true;
            if(toggleAdd.checked){
                if(this.categoryUpdate !== null && this.categoryUpdate.id! >=1){
                    this.fetchUpdateCategory(this.categoryUpdate.id!, valueEnter);
                    categoryLabel.disabled = true;
                }
            }else{
                this.fetchAddCategory(valueEnter);
            }
            // this.fetchCategories();
        });
    }



    goToPage(pageNumber: number) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
          this.currentPage = pageNumber;
          const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
          if (selectAllCheckbox.checked){
            selectAllCheckbox.checked = false;
          }
          this.fetchCategories();
        }
    }


    onCategoryChange() {
        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        const categoryCheckboxes = document.querySelectorAll('.categoryCheckbox') as NodeListOf<HTMLInputElement>;
        const btnSupprimerCheckbox = document.getElementById('btn-supprimer-checkbox') as HTMLButtonElement

        
        let checkedCount = 0;
        categoryCheckboxes.forEach(checkbox => {
          if (checkbox.checked) {
            checkedCount++;
          }
        });

        if(checkedCount == 0) {
            btnSupprimerCheckbox.disabled=true;
        }else{
            if((document.querySelector('#toggleAdd') as HTMLInputElement).checked)
            btnSupprimerCheckbox.disabled = false;
        }
      
        if(checkedCount === categoryCheckboxes.length){
            selectAllCheckbox.checked = true;
        }else{
            selectAllCheckbox.checked = false;
        }
    }

    onCategoryClick(text:string){
        if((document.getElementById('toggleAdd') as HTMLInputElement).checked){
            const categoryLabel = document.getElementById('categoryLabel') as HTMLInputElement;
            categoryLabel.value = text;
            categoryLabel.disabled = false;
        }
    }

    displayMessage(message: string, className: string) {
        const msgDiv = document.querySelector('#msg')! as HTMLDivElement;
    
        msgDiv.innerHTML = '<marquee loop="1" behavior="slide" scrollamount="150" direction="left" id="txt">'+message+'</marquee>';
        msgDiv.style.display = 'block';
        msgDiv.classList.add(className);
    
        setTimeout(() => {
          msgDiv.style.display = 'none';
          msgDiv.innerHTML = '';
          msgDiv.classList.remove(className);
        }, 3000);
    }

    unAuMoinsSelectionner():boolean{
        if((document.getElementById('selectAll') as HTMLInputElement).checked) return true;
        const categoryCheckboxes = document.querySelectorAll('.categoryCheckbox') as NodeListOf<HTMLInputElement>;
        for (const category of categoryCheckboxes) {
            if(category.checked) return true;
        }
        return false;
    }

    asCategory(libelle:string):boolean{
        for (const category of this.categories) {
            if(category.libelle == libelle) {
                this.categoryUpdate = category;
                return true
            };
        }
        return false;
    }



    fetchCategories() {
        // const apiUrl = `http://localhost:8000/api/categories/paginations?page=${this.currentPage}&nbreElementParPage=${this.nbrCategoryPage}&search=bou`;
        const apiUrl = `http://localhost:8000/api/categories/paginations?page=${this.currentPage}&nbreElementParPage=${this.nbrCategoryPage}`;

        this.http.get<ResponseApi<CategoriePaginate>>(apiUrl).subscribe((response:ResponseApi<CategoriePaginate>) => {
            if(response.status == 200){
                this.categories = response.data.data;
                this.currentPage = response.data.current_page;
                this.totalElements = response.data.total;
                this.totalPages = response.data.last_page;
                this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
            }
        },
        (error) => {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
        );
    }

    async fetchDeletesCategories(ids:number[]) {
        const apiUrl = `http://localhost:8000/api/categories`;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json'}),
            body: {"ids": ids},
        };

        try {
            const response = await this.http.delete<ResponseApi<Categorie>>(apiUrl, httpOptions).toPromise();
        
            if (response?.status == 200) {
              await this.fetchCategories();
        
              this.displayMessage(response.message, "alert-success");
            } else {
              this.displayMessage(response!.message, "alert-danger");
            }
        } catch (error) {
        console.error('Erreur lors de la suppression des catégories:', error);
        }

    }

    fetchAddCategory(libelle: string) {
        const apiUrl = `http://localhost:8000/api/categories`;
        
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json'}),
            // body: JSON.stringify({libelle: libelle}),
        };

        this.http.post<ResponseApi<Categorie>>(apiUrl,JSON.stringify({libelle: libelle}), httpOptions).subscribe(response => {
            if(response.status == 200){
                this.displayMessage(response.message, "alert-success");
                this.fetchCategories();
            }else{
                this.displayMessage(response.message, "alert-danger");
            }
        },
        (error) => {
            console.error('Erreur lors de l\'ajout de catégorie:', error);
        });
    }

    fetchUpdateCategory(id:number,libelle: string) {
        const apiUrl = `http://localhost:8000/api/categories/${id}`;
        
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json'}),
            // body: JSON.stringify({libelle: libelle}),
        };

        this.http.put<ResponseApi<Categorie>>(apiUrl,JSON.stringify({libelle: libelle}), httpOptions).subscribe(response => {
            if(response.status == 200){
                this.displayMessage(response.message, "alert-success");
                this.fetchCategories();
            }else{
                this.displayMessage(response.message, "alert-danger");
            }
        },
        (error) => {
            console.error('Erreur lors de l\'ajout de catégorie:', error);
        });
    }
}
