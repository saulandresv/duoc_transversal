import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showAlertError, showToast } from 'src/app/tools/message-functions';
import { User } from '../model/user';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from './database.service'; // Asegúrate de tener un servicio de base de datos para la búsqueda

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageAuthUserKey = 'AUTHENTICATED_USER';
  authUser = new BehaviorSubject<User | null>(null);
  isFirstLogin = new BehaviorSubject<boolean>(false);
  storageQrCodeKey = 'QR_CODE';
  qrCodeData = new BehaviorSubject<string | null>(null);
  selectedComponent = new BehaviorSubject<string>("miclase");

  constructor(private router: Router, private db: DatabaseService, private storage: Storage) { }

  // Método para obtener un usuario por correo
  async getUsuarioByCorreo(correo: string): Promise<User | null> {
    try {
      // Buscar en la base de datos usando el servicio DatabaseService
      const usuario = await this.db.findUserByEmail(correo);
      return usuario ? usuario : null;
    } catch (error) {
      showAlertError('AuthService.getUsuarioByCorreo', error);
      return null;
    }
  }

  // Métodos de autenticación (login, logout, etc.)
  async initializeAuthService() {
    try {
      await this.storage.create();
    } catch (error) {
      showAlertError('AuthService.initializeAuthService', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return Boolean(await this.readAuthUser());
    } catch (error) {
      showAlertError('AuthService.isAuthenticated', error);
      return false;
    }
  }

  async readAuthUser(): Promise<User | null> {
    try {
      const user = (await this.storage.get(this.storageAuthUserKey)) as User | null;
      this.authUser.next(user ?? null);
      return user;
    } catch (error) {
      showAlertError('AuthService.readAuthUser', error);
      return null;
    }
  }

  async saveAuthUser(user: User): Promise<User | null> {
    try {
      window.localStorage.setItem('AUTHENTICATED_USER', JSON.stringify(user));
      await this.storage.set(this.storageAuthUserKey, user);
      this.authUser.next(user);
      return user;
    } catch (error) {
      showAlertError('AuthService.saveAuthUser', error);
      return null;
    }
  }

  async deleteAuthUser(): Promise<boolean> {
    try {
      await this.storage.remove(this.storageAuthUserKey);
      this.authUser.next(null);
      return true;
    } catch (error) {
      showAlertError('AuthService.deleteAuthUser', error);
      return false;
    }
  }

  async login(userName: string, password: string): Promise<boolean> {   
    try {
      const authUser = await this.storage.get(this.storageAuthUserKey);
      // verifica si el usuario esta conectado
      if (authUser) {
        window.localStorage.setItem('isFirstLogin', 'false');
        this.authUser.next(authUser);
        this.isFirstLogin.next(false);
        await this.router.navigate(['/home']);
        return true;
      }
      const user = await this.db.findUser(userName, password);
      if (user) {
        showToast(`¡Bienvenid@ ${user.firstName} ${user.lastName}!`);
        await this.saveAuthUser(user);
        this.isFirstLogin.next(true);
        await this.router.navigate(['/home']);
        return true;
      } else {
        showToast('El correo o la password son incorrectos', 15000);
        await this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      showAlertError('AuthService.login', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const user = await this.readAuthUser();

      if (user) {
        showToast(`¡Hasta pronto ${user.firstName} ${user.lastName}!`);
        await this.deleteAuthUser();
      }

      await this.router.navigate(['/login']);
      return true;
    } catch (error) {
      showAlertError('AuthService.logout', error);
      return false;
    }
  }
}
