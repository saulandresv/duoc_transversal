import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons'; 
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service'; // Asegúrate de tener un servicio de base de datos para 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent // CGV-Lista de idiomas
  ]
})
export class RegistroPage implements ViewWillEnter {

  /** 
   * CGV-INI-Traducciones
   * Para poder utilizar la traducción de textos, se debe:
   *   1. Ejecutar: npm i @ngx-translate/core 
   *   2. Ejecutar: npm i @ngx-translate/http-loader
   *   3. Crear carpeta: src/app/assets/i18n
   *   4. Crear archivo: src/app/assets/i18n/es.json para los textos en español
   *   5. Crear archivo: src/app/assets/i18n/en.json para los textos en inglés
   * 
   * CGV-FIN-Traducciones
  */ 

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  password2: string = '';
  idNivelEducacional: number | undefined = undefined;
  public user: User = User.emptyUser();
  public nivelesEducacionales = NivelEducacional.getNivelesEducacionales();
  public showCalendar: boolean = false;
  locale: string = 'es-ES';  // Valor por defecto en español

  constructor(private router: Router, private toast: ToastController, private db: DatabaseService,private translate: TranslateService) {
    // this.password2 = '123';
    // this.user = {
    //   userName: 'saul',
    //   email: 'saulvega@gmail.com',
    //   password: '123',
    //   secretQuestion: 'si?',
    //   secretAnswer: 'no',
    //   firstName: 'saul',
    //   lastName: 'vega',
    //   educationalLevel: NivelEducacional.getNivelEducacionalById(1)!,
    //   dateOfBirth: new Date(),
    //   address: 'calle 123',
    //   image: ''
    // }
    this.translate.onLangChange.subscribe((event) => {
      this.updateLocale(event.lang);
    });
    this.updateLocale(this.translate.currentLang);
  }
  
  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  public cambiarNivelEducacional(event: any): void {
    this.idNivelEducacional = event?.detail?.value;
    const nivelEducacional = NivelEducacional.getNivelEducacionalById(this.idNivelEducacional);
    if (nivelEducacional instanceof NivelEducacional) {
      this.user.educationalLevel = nivelEducacional;
    }
  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  updateLocale(lang: string) {
    switch (lang) {
      case 'es':
        this.locale = 'es-ES';
        break;
      case 'de':
        this.locale = 'de-DE';
        break;
      case 'en':
      default:
        this.locale = 'en-US';
        break;
    }
  }

  async registerNewUser(): Promise<void> {

    const passwordsMismatchMessage = await this.translate.get('Register.ErrorMessages.PasswordsMismatch').toPromise();
    const usernameExistsMessage = await this.translate.get('Register.ErrorMessages.UsernameExists').toPromise();
    const successMessage = await this.translate.get('Register.SuccessMessages.RegistrationComplete').toPromise();
    const failMessage = await this.translate.get('Register.ErrorMessages.RegistrationFailed').toPromise();

    

    if (this.password2 !== this.user.password) {
      const toast = await this.toast.create({
        message: 'Las contraseñas no coinciden.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
      return;
    }
    try {
      const user = await User.getNewUsuario(
        this.user.userName,
        this.user.email,
        this.user.password,
        this.user.secretQuestion,
        this.user.secretAnswer,
        this.user.firstName,
        this.user.lastName,
        this.user.educationalLevel,
        new Date(this.user.dateOfBirth),
        this.user.address,
        '',
        'user'
      );
      const user1 = await this.db.readUser(user.userName);
      if (!user1) {
        await this.db.saveUser(user);
        const successMessage = await this.translate.get('Register.SuccessMessages.RegistrationComplete').toPromise();
        const toast = await this.toast.create({
          message: successMessage,
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        toast.present();
      } else {
        const usernameExistsMessage = await this.translate.get('Register.ErrorMessages.UsernameExists').toPromise();
        const toast = await this.toast.create({
          message: usernameExistsMessage,
          duration: 2000,
          position: 'bottom',
          color: 'warning'
        });
        toast.present();
      }
      } catch (error) {
        console.log(error);
        const errorMessage = await this.translate.get('Register.ErrorMessages.RegistrationFailed').toPromise();
        const toast = await this.toast.create({
          message: errorMessage,
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        toast.present();
      }
  }

  login() {
    console.log('Navegando a la página de registro');
    this.router.navigate(['/login']);
  }

  showMap() {
    this.router.navigate(['/map']);
  }

}
