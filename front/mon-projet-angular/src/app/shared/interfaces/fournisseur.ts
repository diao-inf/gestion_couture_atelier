export interface Fournisseur {
    id?: number,
    nom: string,
    prenom: string,
    fullname?: string,
}

export class FournisseurImpl implements Fournisseur {
    id?: number;
    nom: string="";
    prenom: string="";
    fullname: string = `${this.prenom} ${this.nom}`;
  
    // get fullname(): string {
    //   return `${this.prenom} ${this.nom}`;
    // }

    // set fullname(val: string){
    //   this.fullname = val;
    // }
  }
