  import { NivelEducacional } from './nivel-educacional';
  import { Person } from "./person";
  import { DatabaseService } from '../services/database.service';
  import { inject } from '@angular/core';
  import { convertDateToString } from '../tools/date-functions';

  export class User extends Person {

    userName = '';
    email = '';
    password = '';
    secretQuestion = '';
    secretAnswer = '';
    //db = inject(DataBaseService);
    image = '';
    role = '';

    constructor() {
      super();
    }

    public static emptyUser () {
      const user = new User();
      user.userName = '';
      user.email = '';
      user.password = '';
      user.secretQuestion = '';
      user.secretAnswer = '';
      user.firstName = '';
      user.lastName = '';
      user.educationalLevel = NivelEducacional.getNivelEducacionalById(1)!;
      user.dateOfBirth = new Date();
      user.address = '';
      user.image = '';
      user.role = '';
      return user;
    }

    static getNewUsuario(
      userName: string,
      email: string,
      password: string,
      secretQuestion: string,
      secretAnswer: string,
      firstName: string,
      lastName: string,
      educationalLevel: NivelEducacional,
      dateOfBirth: Date,
      address: string,
      image: string,
      role: string
    ) {
      let usuario = new User();
      usuario.userName = userName;
      usuario.email = email;
      usuario.password = password;
      usuario.secretQuestion = secretQuestion;
      usuario.secretAnswer = secretAnswer;
      usuario.firstName = firstName;
      usuario.lastName = lastName;
      usuario.educationalLevel = educationalLevel;
      usuario.dateOfBirth = dateOfBirth;
      usuario.address = address;
      usuario.image = image;
      usuario.role = role;
      return usuario;
    }

    // async findUser(userName: string, password: string): Promise<User | undefined> {
    //   return await this.db.findUser(userName, password);
    // }

    // async findByUserName(userName: string): Promise<User | undefined>  {
    //   return await this.db.findUserByUserName(userName);
    // }

    // async findByEmail(email: string): Promise<User | undefined>  {
    //   return await this.db.findUserByEmail(email);
    // }

    // async save(): Promise<void> {
    //   this.db.saveUser(this);
    // }

    // async delete(userName: string): Promise<void>  {
    //   this.db.deleteByUserName(userName);
    // }

    override toString(): string {
      return `\n
          User name: ${this.userName}\n
          Email: ${this.email}\n
          Password: ${this.password}\n
          secretQuestion: ${this.secretQuestion}\n
          secretAnswer: ${this.secretAnswer}\n
          First name: ${this.firstName}\n
          Last name: ${this.lastName}\n
          Education level: ${this.educationalLevel.getTextoNivelEducacional()}\n
          Date of birth: ${convertDateToString(this.dateOfBirth)}\n
          Address: ${this.address}\n
          Image: ${this.image !== ''}\n
          Role: ${this.role}\n
        `;
    }

  }