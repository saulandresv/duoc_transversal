import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, HeaderComponent,TranslateModule]
})
export class CorreoPage implements AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  public correo: string = '';
  public usuario: any;
  public respuesta: string = '';

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private animationController: AnimationController,
    private toastController: ToastController,
    private authService: AuthService,
    private translate: TranslateService

  ) {
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

  // Función para cerrar sesión
  logout() {
    this.authService.logout();
  }

  // Función para validar el correo y redirigir a la siguiente página
  public async ingresarPaginaValidarRespuestaSecreta(): Promise<void> {
    if (!this.correo || !this.correo.includes('@')) {
      this.toastController
        .create({
          message: 'Por favor, ingresa un correo válido.',
          duration: 2000,
          color: 'danger',
        })
        .then((toast) => toast.present());
      return;
    }

    // Usar el servicio AuthService para buscar el usuario por correo
    try {
      const usuarioEncontrado = await this.authService.getUsuarioByCorreo(this.correo);

      if (!usuarioEncontrado) {
        this.toastController
          .create({
            message: 'Usuario no encontrado. Verifica los datos ingresados.',
            duration: 2000,
            color: 'danger',
          })
          .then((toast) => toast.present());

        const navigationExtras: NavigationExtras = {
          state: {
            mensaje: this.translate.instant('ErrorMessages.InvalidData'),
          },
        };
        this.router.navigate(['/incorrecto'], navigationExtras);
      } else {
        console.log('Usuario encontrado:', usuarioEncontrado);
        const navigationExtras: NavigationExtras = {
          state: {
            usuario: usuarioEncontrado,
          },
        };
        this.router.navigate(['/pregunta'], navigationExtras);
      }
    } catch (error) {
      this.toastController
        .create({
          message: 'Hubo un error al buscar el usuario.',
          duration: 2000,
          color: 'danger',
        })
        .then((toast) => toast.present());
    }
  }
}
