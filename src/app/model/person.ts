import { NivelEducacional } from './nivel-educacional';

export class Person {

  firstName = '';
  lastName = '';
  educationalLevel: NivelEducacional = NivelEducacional.getNivelEducacionalById(1)!;
  dateOfBirth: Date = new Date();
  address = '';

  constructor() { }

}
