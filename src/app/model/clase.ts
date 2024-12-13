import { showAlert, showAlertError } from "../tools/message-functions";

export class Clase {

  static jsonclaseExample =
    `{
      "sede": "Alonso Ovalle",
      "idAsignatura": "PGY4121",
      "seccion": "001D",
      "nombreAsignatura": "Aplicaciones Móviles",
      "nombreProfesor": "Cristián Gómez Vega",
      "dia": "2022-08-09",
      "bloqueInicio": 7,
      "bloqueTermino": 9,
      "horaInicio": "13:00",
      "horaFin": "15:15" 
    }`;
  
    static jsonclaseEmpty =
    `{
      "sede": "",
      "idAsignatura": "",
      "seccion": "",
      "nombreAsignatura": "",
      "nombreProfesor": "",
      "dia": "",
      "bloqueInicio": 0,
      "bloqueTermino": 0,
      "horaInicio": "",
      "horaFin": "" 
    }`;

    sede= "";
    idAsignatura= "";
    seccion= "";
    nombreAsignatura= "";
    nombreProfesor= "";
    dia= "";
    bloqueInicio= 0;
    bloqueTermino= 0;
    horaInicio= "";
    horaFin= "" 

  constructor() { }

  public static getNewClase(
    sede: string,
    idAsignatura: string,
    seccion: string,
    nombreAsignatura: string,
    nombreProfesor: string,
    dia: string,
    bloqueInicio: number,
    bloqueTermino: number,
    horaInicio: string,
    horaFin: string 
  ) {
    const clase = new Clase();
    clase.sede = sede;
    clase.idAsignatura = idAsignatura;
    clase.seccion = seccion;
    clase.nombreAsignatura = nombreAsignatura;
    clase.nombreProfesor = nombreProfesor;
    clase.dia = dia;
    clase.bloqueInicio = bloqueInicio;
    clase.bloqueTermino = bloqueTermino;
    clase.horaInicio = horaInicio;
    clase.horaFin = horaFin;
    return clase;
  }


  static isValidClaseQrCode(qr: string) {
    
    if (qr === '') return false;

    try {
      const json = JSON.parse(qr);

      if ( json.sede       !== undefined
        && json.idAsignatura     !== undefined
        && json.seccion     !== undefined
        && json.nombreAsignatura     !== undefined
        && json.nombreProfesor       !== undefined
        && json.dia     !== undefined
        && json.bloqueInicio !== undefined
        && json.bloqueTermino      !== undefined
        && json.horaInicio      !== undefined
        && json.horaFin      !== undefined)
      {
        return true;
      }
    } catch(error) { }

    showAlert('El código QR escaneado no corresponde a una clase');
    return false;
  }
  
}
