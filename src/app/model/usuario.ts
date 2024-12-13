import { Persona } from './persona';
import { NivelEducacional } from './nivel-educacional';

export class Usuario {
  public correo = '';
  public password = '';
  public nombre = '';
  public apellido = '';
  public preguntaSecreta = '';
  public respuestaSecreta = '';
  public nivelEducacional: NivelEducacional = new NivelEducacional();
  public fechaNacimiento = '';

  constructor(
    correo: string, password: string, nombre: string, apellido: string, preguntaSecreta: string, respuestaSecreta: string = ' ',nivelEducacional: NivelEducacional = new NivelEducacional(),
    fechaNacimiento: string = '')
  {
    this.correo = correo;
    this.password = password;
    this.nombre = nombre;
    this.apellido = apellido;
    this.preguntaSecreta = preguntaSecreta;
    this.respuestaSecreta = respuestaSecreta;
    this.nivelEducacional = nivelEducacional;
    this.fechaNacimiento = fechaNacimiento;
  }

  public listaUsuariosValidos(): Usuario[] {
    const lista = [];
    const nivel1 = new NivelEducacional();
  nivel1.setNivelEducacional(1, 'Básica Incompleta');
  
  const nivel2 = new NivelEducacional();
  nivel2.setNivelEducacional(2, 'Básica Completa');
  
  const nivel3 = new NivelEducacional();
  nivel3.setNivelEducacional(3, 'Media Incompleta');
  
  const nivel4 = new NivelEducacional();
  nivel4.setNivelEducacional(4, 'Media Completa');
  
  const nivel5 = new NivelEducacional();
  nivel5.setNivelEducacional(5, 'Superior Incompleta');
  
  const nivel6 = new NivelEducacional();
  nivel6.setNivelEducacional(6, 'Superior Completa');
  
  lista.push(new Usuario('atorres@duocuc.cl', '1234', 'Ana', 'Torres Leiva', '¿Cuál es tu animal favorito?', 'gato', nivel3, '1990-01-01'));
  lista.push(new Usuario('jperez@duocuc.cl', '5678', 'Juan', 'Pérez González', '¿Cuál es tu postre favorito?', 'panqueques', nivel2, '2002-03-20'));
  lista.push(new Usuario('cmujica@duocuc.cl', '0987', 'Carla', 'Mujica Sáez', '¿Cuál es tu vehículo favorito?', 'moto', nivel4, '199-03-12'));
    return lista;
  }

  public static buscarUsuarioPorCorreo(correo: string): Usuario | null {
    const usuarios = new Usuario('', '', '', '','', '').listaUsuariosValidos();  // Obtener la lista de usuarios válidos
    const usuarioEncontrado = usuarios.find(usu => usu.correo === correo);
    return usuarioEncontrado || null;
  }

  public buscarUsuarioValido(correo: string, password: string): Usuario | null {
    const usuario = this.listaUsuariosValidos().find(
      usu => usu.correo === correo && usu.password === password);
    if (usuario !== undefined) {
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
      return usuario;
    } else {
      return null;
    }
  }

  public validarcorreo(): string {
    if (this.correo.trim() === '') {
      return 'Para ingresar al sistema debe ingresar un nombre de usuario.';
    }
    if (this.correo.length < 3 || this.correo.length > 8) {
      return 'El nombre de usuario debe tener entre 3 y 8 caracteres.';
    }
    return '';
  }

  public validarPassword(): string {
    if (this.password.trim() === '') {
      return 'Para entrar al sistema debe ingresar la contraseña.';
    }
    for(let i = 0; i < this.password.length; i++) {
      if ('0123456789'.indexOf(this.password.charAt(i)) === -1) {
        return 'La contraseña debe ser numérica.';
      }
    }
    if (this.password.length !== 4) {
      return 'La contraseña debe ser numérica de 4 dígitos.';
    }
    return '';
  }

  public validarUsuario(): string {
    return this.validarcorreo()
      || this.validarPassword();
  }
}