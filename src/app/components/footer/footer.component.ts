import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { desktopOutline, homeOutline, pawOutline, pencilOutline, personOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , TranslateModule // CGV-Permite usar pipe 'translate'
    , IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon
  ]
})
export class FooterComponent {
  user: User = new User();
  selectedButton = 'welcome';
  @Output() footerClick = new EventEmitter<string>();

  constructor(private auth: AuthService,) { 
    addIcons({ homeOutline, qrCodeOutline, pawOutline, pencilOutline, desktopOutline, personOutline });
    this.auth.authUser.subscribe((user) => {
      console.log('User:', user);
      if (user) {
        this.user = user;
      }
    });
  }

  sendClickEvent($event: any) {
    this.footerClick.emit(this.selectedButton);
  }

}
