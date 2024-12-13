import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { NivelEducacional } from  'src/app/model/nivel-educacional'
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class MisdatosComponent implements OnInit, AfterViewInit {
  user: User = new User();
  public showCalendar: boolean = false
  public idNivelEducacional: number | undefined = undefined;
  public nivelesEducacionales = NivelEducacional.getNivelesEducacionales();
  public password1: string = '';
  public password2: string = '';

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  ngOnInit() {
    console.log(this.user.educationalLevel);
  }

  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
    private animationController: AnimationController,
    private auth: AuthService,
    private toastController: ToastController
  ) {
    this.auth.authUser.subscribe((user) => {
      if (user) {
        this.user = user;
        this.idNivelEducacional = user.educationalLevel.id;
      }
    });
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

  cambiarNombre(event: any) {
    this.user.firstName = event;
  }

  cambiarApellido(event: any) {
    this.user.lastName = event;
  }

  limpiarFormulario() {
    this.user = new User();
  }

  public cambiarNivelEducacional(event: any): void {
    this.idNivelEducacional = event.detail.value;
    const nivelEducacional = NivelEducacional.getNivelEducacionalById(this.idNivelEducacional);
    if (nivelEducacional instanceof NivelEducacional) {
      this.user.educationalLevel = nivelEducacional;
    }
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  mostrarDatosUsuario() {
    console.log('Datos del usuario cargados:', this.user);
  }

  async mostrarToast(mensaje: string, tipo: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración en milisegundos
      position: 'bottom', // Posición del toast
      color: tipo // Cambia a 'danger' si es un mensaje de error
    });
    toast.present();
  }

  async actualizarDatos(): Promise<void> {
    if(this.password1 !== '' && this.password1 === this.password2) {
      const fields = [
        'userName',
        'email',
        'password',
        'secretQuestion',
        'secretAnswer',
        'firstName',
        'lastName',
        'educationalLevel',
        'dateOfBirth',
        'address'
      ]
      let fail = false;
      fields.forEach((field) => {
        if ((this.user as any)[field] === '') {
          this.mostrarToast('Todos los campos son obligatorios.', 'danger');
          fail = true;
          return;
        }
      });
      function validateEmail(email: string): boolean {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
      if (!validateEmail(this.user.email)) {
        this.mostrarToast('El email no es válido.', 'danger');
        fail = true;
      }
      if (fail) return;
      try {
        this.user.educationalLevel = NivelEducacional.getNivelEducacionalById(this.idNivelEducacional) as NivelEducacional;
        await this.userService.actualizarUsuario(this.user);
        this.mostrarToast('Datos actualizados correctamente.');
      } catch (error) {
        console.log(error);
        this.mostrarToast('Error al actualizar los datos.', 'danger');
      }
    } else {
      this.mostrarToast('Las contraseñas tienen que ser iguales.', 'danger');
    }
  }

  get nombreUsuario(): string | any {
    return this.user.email.split('@')[0];
  }


}
