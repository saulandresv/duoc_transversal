// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { DatabaseService } from './database.service'; // Asegúrate de tener un servicio de base de datos para la búsqueda

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: DatabaseService) { }
  private usuarioAutenticado: User | null = null;

  // Guardar el usuario autenticado
  setUsuarioAutenticado(usuario: User) {
    this.usuarioAutenticado = usuario;
  }

  // Obtener el usuario autenticado
  obtenerUsuarioAutenticado(): User | null {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      this.setUsuarioAutenticado(usuario);
    }
    return this.usuarioAutenticado;
  }

  actualizarUsuario(usuarioActualizado: User): Promise<Boolean> {
    return this.db.updateUser(usuarioActualizado);
  }
}