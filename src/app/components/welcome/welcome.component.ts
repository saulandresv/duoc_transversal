import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/model/user';
import { EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { QrWebScannerComponent } from '../qr-web-scanner/qr-web-scanner.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [TranslateModule, QrWebScannerComponent, IonicModule, CommonModule],
})
export class WelcomeComponent implements OnInit {
  user: User = new User();
  isScannerVisible = false;

  @Output() headerClick = new EventEmitter<string>();

  constructor(private auth: AuthService) {
    this.auth.authUser.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit() {}

  toggleScanner() {
    this.isScannerVisible = !this.isScannerVisible;
  }
  
  onQrScanned(data: string) {
    console.log('QR Data:', data);
    this.isScannerVisible = false; // Oculta el escáner después de escanear
  }
}
