import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,
  imports: [IonicModule,TranslateModule ]
})
export class IncorrectoPage implements OnInit, AfterViewInit {
  public mensaje: string = '';

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private animationController: AnimationController,
    private authService: AuthService
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras.state && navigation.extras.state['mensaje']) {
        this.mensaje = navigation.extras.state['mensaje'];
      } else {
        this.mensaje = 'Mensaje no disponible';
      }
    });
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(3000)
        .fromTo('transform', 'translateX(0%)', 'translateX(100%)')
        .fromTo('opacity', 0.2, 1);
      animation.play();
    }
  }
}
