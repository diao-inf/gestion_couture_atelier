import { AbstractInterface } from "./abstract-interface";

export interface Article extends AbstractInterface{
    prix: number,
    stock: number,
    reference: string,
    photo?: string,
    categorie_id: number,
    categorie_libelle?:string,
    fournisseur_ids?: number[],
}
