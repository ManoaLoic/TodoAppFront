export class Auteur {
    _id?: string;
    nom?: string;
    image?: string;
}

export class Matiere {
    _id?: string;
    nom!: string;
    image?: string;
    prof_img?: string;
}

export class Assignment {
    _id?: string;
    nom!: string;
    dateDeRendu!: Date;
    rendu!: boolean;
    note?: number;
    auteur!: Auteur;
    matiere!: Matiere;
    remarque?: string;
}
