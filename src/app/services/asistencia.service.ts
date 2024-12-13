import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Asistencia {
  bloqueInicio: number;
  bloqueTermino: number;
  dia: string;
  horaFin: string;
  horaInicio: string;
  idAsignatura: string;
  nombreAsignatura: string;
  nombreProfesor: string;
  seccion: string;
  sede: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private asistenciaSubject = new BehaviorSubject<Asistencia | null>(null);
  asistencia$ = this.asistenciaSubject.asObservable();

  setAsistencia(asistencia: Asistencia) {
    this.asistenciaSubject.next(asistencia);
  }
}