import { TranslateService } from '@ngx-translate/core';
export class NivelEducacional {
  public id: number;
  public nombre: string;

  public constructor() {
    this.id = 0;
    this.nombre = '';
  }

  public static getNivelEducacional(id: number, nombre: string): NivelEducacional {
    const nived = new NivelEducacional();
    nived.id = id;
    nived.nombre = nombre;
    return nived;
  }

  public static getNivelEducacionalById(id: number | undefined): NivelEducacional | undefined {
    return NivelEducacional.getNivelesEducacionales().find(n => n.id === id);
  }

  public static getNivelesEducacionales(): NivelEducacional[] {
    const nivelesEducacionales = [];
    nivelesEducacionales.push(NivelEducacional.getNivelEducacional(1, 'Básica Incompleta'));
    nivelesEducacionales.push(NivelEducacional.getNivelEducacional(2, 'Básica Completa'));
    nivelesEducacionales.push(NivelEducacional.getNivelEducacional(3, 'Media Incompleta'));
    nivelesEducacionales.push(NivelEducacional.getNivelEducacional(4, 'Media Completa'));
    nivelesEducacionales.push(NivelEducacional.getNivelEducacional(5, 'Superior Incompleta'));
    nivelesEducacionales.push(NivelEducacional.getNivelEducacional(6, 'Superior Completa'));
    return nivelesEducacionales;
  }

  public setNivelEducacional(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }

 
  public static findNombreBy(id: number) {
    if (id < 1 || id > 6) {
      return 'Sin nivel educacional';
    }
    const nived = NivelEducacional.getNivelesEducacionales().find(n => n.id === id);
    if (nived !== undefined) {
     return nived.nombre;
    } else {
      return `Nivel educacional con id=${id} no fue encontrado`;
    }
  }

  public getTextoId(): string {
    if (this.id < 1 || this.id > 6) {
      return 'Sin nivel educacional';
    }
    return this.id.toString();
  }

  public getTextoNombre(): string {
    return this.nombre? this.nombre : 'No asignado';
  }

  public getTextoNivelEducacional(): string {
    if (this.id < 1 || this.id > 6) {
      return 'No asignado';
    } else {
      return this.id.toString() + ' - ' + NivelEducacional.findNombreBy(this.id);
    }
  }
}
