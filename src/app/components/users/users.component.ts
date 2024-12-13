import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AnimationController } from '@ionic/angular';
import { User } from 'src/app/model/user'; // Importa la clase User correctamente
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], // Importa los módulos necesarios
})
export class UsersComponent implements OnInit, AfterViewInit {
  users: User[] = []; // Lista de usuarios cargados, usa la clase User

  constructor(
    private databaseService: DatabaseService,
    private animationController: AnimationController,
    private toastController: ToastController // Para mostrar notificaciones
  ) {}

  @ViewChild('users', { read: ElementRef }) itemTitulo!: ElementRef; 

  async ngOnInit() {
    // Carga inicial de usuarios
    await this.loadUsers();
  }

  ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(6000)
        .fromTo('transform', 'translate(0%)', 'translate(100%)')
        .fromTo('opacity', 0.2, 1);
      animation.play();
    }
  }

  // Carga la lista de usuarios desde la base de datos
  async loadUsers() {
    try {
      this.users = await this.databaseService.readUsers();
    } catch (error) {
      this.showErrorToast('Error al cargar los usuarios.');
    }
  }

  // Elimina un usuario por su nombre de usuario
  async deleteUser(userName: string) {
    try {
      const success = await this.databaseService.deleteByUserName(userName);
      if (success) {
        this.showSuccessToast('Usuario eliminado correctamente.');
        await this.loadUsers(); // Recarga la lista después de eliminar
      } else {
        this.showErrorToast('No se pudo eliminar el usuario.');
      }
    } catch (error) {
      this.showErrorToast('Error al eliminar el usuario.');
    }
  }

  // Muestra un mensaje de éxito
  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  }

  // Muestra un mensaje de error
  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
}
