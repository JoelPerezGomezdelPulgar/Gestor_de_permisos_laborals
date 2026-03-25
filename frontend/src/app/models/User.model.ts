export class UserModel {
  _id: string;
  nom: string;
  primerCognom: string;
  segonCognom: string;
  email: string;
  username: string;
  password: string;
  imatge: string;
  rol: string;

  constructor() {
    this._id = "";
    this.nom = "";
    this.primerCognom = "";
    this.segonCognom = "";
    this.email = "";
    this.username = "";
    this.password = "";
    this.imatge = "";
    this.rol = "";
  }
}

export interface ApiResponseModel {
  message: string;
  data: any;

}

export interface LoginModel {
  username: string;
  password: string;

}

export interface EmailModel {
  email: string;
}