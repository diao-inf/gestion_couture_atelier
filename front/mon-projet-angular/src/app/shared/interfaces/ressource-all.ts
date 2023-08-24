import { Article } from "./article";
import { Categorie } from "./categorie";
import { Fournisseur } from "./fournisseur";

export interface RessourceAll {
    fournisseur:Fournisseur[];
    categorie:Categorie[];
    article:Article[];
}
