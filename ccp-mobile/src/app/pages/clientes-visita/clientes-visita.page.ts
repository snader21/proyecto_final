import { Component, OnInit } from '@angular/core';
import { VisitaService } from '../../services/visita.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { CreateVisitaDto } from 'src/app/interfaces/visita.interface';
import { VideoRecorderComponent } from '../../components/video-recorder/video-recorder.component';

@Component({
  selector: 'app-clientes-visita',
  templateUrl: './clientes-visita.page.html',
  styleUrls: ['./clientes-visita.page.scss'],
  standalone: false,
})
export class ClientesVisitaPage implements OnInit {
  visitaForm: FormGroup;
  cliente: Cliente | null = null;
  recordedVideoUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private visitaService: VisitaService,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) {
    this.visitaForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      observaciones: [''],
      realizo_pedido: [false, Validators.required],
    });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cliente = navigation.extras.state['cliente'];
    }

    // Set default date and time
    const now = new Date();
    this.visitaForm.patchValue({
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(':').slice(0, 2).join(':'),
    });
  }

  async grabarVideo() {
    const modal = await this.modalCtrl.create({
      component: VideoRecorderComponent,
      cssClass: 'modal-fullscreen'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.recordedVideoUrl = data;
    }
  }

  async onSubmit() {
    if (this.visitaForm.valid && this.cliente) {
      const formValue = this.visitaForm.value;

      // Crear objeto de visita
      const visitaData: CreateVisitaDto = {
        id_cliente: this.cliente.id_cliente,
        fecha_visita: new Date(`${formValue.fecha}T${formValue.hora}`),
        observaciones: formValue.observaciones || undefined,
        realizo_pedido: formValue.realizo_pedido,
        key_object_storage: null,
        url: this.recordedVideoUrl || null
      };

      try {
        await this.visitaService.crearVisita(visitaData).toPromise();

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Visita registrada correctamente',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/clientes'], { replaceUrl: true });
            }
          }]
        });

        await alert.present();
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo registrar la visita',
          buttons: ['OK']
        });

        await alert.present();
      }
    }
  }
}
