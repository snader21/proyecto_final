import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../interfaces/product.interfaces';

@Component({
  selector: 'app-gestionar-inventario',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './gestionar-inventario.component.html',
  styleUrls: ['./gestionar-inventario.component.scss']
})
export class GestionarInventarioComponent {
  @Input() product?: Product;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }
}
