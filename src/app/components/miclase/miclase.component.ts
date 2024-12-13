import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Asistencia, AsistenciaService } from '../../services/asistencia.service';
import { AnimationController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { IonFabButton, IonFab, IonList, IonCardContent, IonHeader
  , IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle
  , IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea
  , IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent
  , IonFabList } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonCard
    , IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem
    , IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol
    , IonButton, IonIcon, IonContent, IonCardContent
    , IonFab, IonFabButton, IonFabList
    , CommonModule, FormsModule,TranslateModule]
})
export class MiclaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  asistencia: Asistencia | null = null;
  private asistenciaSubscription!: Subscription;
  clase: any;
  private subscription: Subscription;

  constructor(private authService: AuthService,private asistenciaService: AsistenciaService, private animationController: AnimationController, private userService: UserService) {
    { 
      this.subscription = this.authService.qrCodeData.subscribe((qr) => {
        this.clase = qr? JSON.parse(qr): null;
      })
    }
  }

  ngOnInit() {
    this.asistenciaSubscription = this.asistenciaService.asistencia$.subscribe((data: Asistencia | null) => {
      this.asistencia = data;
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

  ngOnDestroy() {
    if (this.asistenciaSubscription) {
      this.asistenciaSubscription.unsubscribe();
    }
  }
}
