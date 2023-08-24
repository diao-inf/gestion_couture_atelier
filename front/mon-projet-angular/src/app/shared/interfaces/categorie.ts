import { AbstractInterface } from "./abstract-interface"

export interface Categorie extends AbstractInterface {
    
}

export interface CategoriePaginate{
    current_page: number,
    first_page_url?:string, 
    last_page: number,
    last_page_url?: string,
    per_page: number,
    total: number
    data:Categorie[]
}
