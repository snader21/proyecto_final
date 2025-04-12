import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Cliente {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-clientes-visita',
  templateUrl: './clientes-visita.page.html',
  styleUrls: ['./clientes-visita.page.scss'],
  standalone: false
})
export class ClientesVisitaPage implements OnInit {
  visitaForm: FormGroup;
  cliente: Cliente | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.visitaForm = this.formBuilder.group({
      fecha: [''],
      hora: [''],
      observaciones: [''],
      realizarPedido: [false]
    });
  }

  ngOnInit() {
    // Get client from route parameters
    this.route.queryParams.subscribe(params => {
      if (params['cliente']) {
        this.cliente = JSON.parse(params['cliente']);
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

  onSubmit() {
    if (this.visitaForm.valid) {
      console.log('Datos de la visita:', this.visitaForm.value);
      // Aquí iría la lógica para guardar la visita
    }
  }
}
