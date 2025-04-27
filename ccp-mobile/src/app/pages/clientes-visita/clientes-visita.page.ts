import { Component, OnInit } from '@angular/core';
import { VisitaService } from '../../services/visita.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface ClienteData {
  id_cliente: string;
  nombre: string;
  [key: string]: any;
}

interface CreateVisitaDto {
  id_cliente: string;
  fecha_visita: Date;
  observaciones?: string;
  realizo_pedido?: boolean;
  key_object_storage?: string;
  url?: string;
}

@Component({
  selector: 'app-clientes-visita',
  templateUrl: './clientes-visita.page.html',
  styleUrls: ['./clientes-visita.page.scss'],
  standalone: false,

})
export class ClientesVisitaPage implements OnInit {
  visitaForm: FormGroup;
  cliente: ClienteData | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private visitaService: VisitaService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.visitaForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      observaciones: [''],
      realizo_pedido: [false, Validators.required],
    });
  }

  ngOnInit() {
    // Get client from route parameters
    this.route.queryParams.subscribe(params => {
      if (params['cliente']) {
        const clienteData = JSON.parse(params['cliente']);
        this.cliente = clienteData;
      }
    });

    // Set default date and time
    const now = new Date();
    this.visitaForm.patchValue({
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(':').slice(0, 2).join(':'),
    });
  }

  grabarVideo() {
    console.log('Iniciando grabación de video...');
    // Aquí iría la lógica para grabar video
  }

  subirVideo() {
    console.log('Subiendo video...');
    // Aquí iría la lógica para subir video
  }

  async onSubmit() {
    if (this.visitaForm.valid && this.cliente) {
      const formValue = this.visitaForm.value;

      // Crear objeto de visita
      const visitaData = {
        id_cliente: this.cliente.id_cliente,
        fecha_visita: new Date(`${formValue.fecha}T${formValue.hora}`),
        observaciones: formValue.observaciones || undefined,
        realizo_pedido: Boolean(formValue.realizo_pedido),
        key_object_storage: undefined,
        url: undefined
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
