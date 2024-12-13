import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone'
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { QrWebScannerComponent } from 'src/app/components/qr-web-scanner/qr-web-scanner.component';
import { Clase } from 'src/app/model/clase';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { DatabaseService } from 'src/app/services/database.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MiclaseComponent } from 'src/app/components/miclase/miclase.component';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { UsersComponent } from 'src/app/components/users/users.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
      CommonModule, FormsModule, TranslateModule, IonContent
    , HeaderComponent, FooterComponent
    , WelcomeComponent, QrWebScannerComponent
    , ForumComponent, MiclaseComponent, MisdatosComponent, UsersComponent
  ]
})
export class HomePage {
  public users: any[] = [];
  
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';

  constructor(private auth: AuthService, private scanner: ScannerService) {}

  ionViewWillEnter() {
    this.changeComponent('welcome');
  }

  async headerClick(button: string) {

    if (button === 'testqr')
      this.showClaseComponent(Clase.jsonclaseExample);

    if (button === 'scan' && Capacitor.getPlatform() === 'web')
      this.selectedComponent = 'qrwebscanner';

    if (button === 'scan' && Capacitor.getPlatform() !== 'web')
        this.showClaseComponent(await this.scanner.scan());
  }

  webQrScanned(data: string) {
    if (Clase.isValidClaseQrCode(data)) {
      this.auth.qrCodeData.next(data);
      this.changeComponent('miclase');
    } else {
      this.changeComponent('welcome');
    }
  } 

  webQrStopped() {
    this.changeComponent('welcome');
  }

  showClaseComponent(qr: string) {

    if (Clase.isValidClaseQrCode(qr)) {
      this.auth.qrCodeData.next(qr);
      this.changeComponent('miclase');
      return;
    }
    
    this.changeComponent('welcome');
  }


  footerClick(button: string) {
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }


}
