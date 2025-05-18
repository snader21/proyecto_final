import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { VideoModalComponent } from 'src/app/components/video-viewer/video-modal.component';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { VisitaService } from 'src/app/services/visita.service';

@Component({
  selector: 'app-clientes-detalle',
  templateUrl: './clientes-detalle.page.html',
  styleUrls: ['./clientes-detalle.page.scss'],
  standalone: false
})
export class ClientesDetallePage implements OnInit {
  cliente: Cliente | null = null;
  visitas: any[] = [];

  constructor(
    private readonly router: Router,
    private readonly visitasService: VisitaService,
    private readonly alertCtrl: AlertController,
    private readonly modalCtrl: ModalController,
    private readonly translate: TranslateService
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cliente = navigation.extras.state['cliente'];
      this.cargarVisitas();
    }
  }

  navegarAVisita() {
    if (this.cliente) {
      this.router.navigate(['/clientes-visita'], {
        state: { cliente: this.cliente }
      });
    }
  }

  cargarVisitas() {
    if (this.cliente?.id_cliente) {
      this.visitasService.obtenerVisitasCliente(this.cliente.id_cliente).subscribe({
        next: (data) => {
          this.visitas = data;
          console.log('Visitas cargadas:', data);
        },
        error: (err) => {
          console.error('Error al cargar visitas:', err);
        }
      });
    }
  }

  async verRecomendacion(visita: any) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('CLIENT_DETAIL.RECOMMENDATION'),
      message: visita.recomendacion || this.translate.instant('CLIENT_DETAIL.NO_RECOMMENDATION'),
      buttons: [this.translate.instant('CLIENT_DETAIL.CLOSE')]
    });
    await alert.present();
  }

  realizoPedido(realizo_pedido: boolean) {
    return realizo_pedido 
      ? this.translate.instant('CLIENT_DETAIL.ORDER_STATUS.MADE')
      : this.translate.instant('CLIENT_DETAIL.ORDER_STATUS.NOT_MADE');
  }

  async verVideo(visita: any) {
    if (!visita.key_object_storage) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('CLIENT_DETAIL.NO_VIDEO'),
        message: this.translate.instant('CLIENT_DETAIL.NO_VIDEO_MSG'),
        buttons: [this.translate.instant('CLIENT_DETAIL.CLOSE')]
      });
      await alert.present();
      return;
    }
    const data = await firstValueFrom(this.visitasService.obtenerVideo(visita.key_object_storage)); // Reemplaza tu-bucket
    const modal = await this.modalCtrl.create({
      component: VideoModalComponent, // Debes crear este componente
      componentProps: { url: data.url }
    });
    await modal.present();
  }
}
