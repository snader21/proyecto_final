import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Ubicacion {
  id_ubicacion: string;
  nombre: string;
  descripcion: string;
  cantidad_disponible: number;
  tiene_inventario: boolean;
}

@Component({
  selector: 'app-bodega-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bodega-map-container">
      <div class="map-header">
        <h6>{{ bodega.nombre }}</h6>
      </div>
      <div class="warehouse-plan">
        <div class="warehouse-walls"></div>
        <div class="warehouse-label">Plano de Bodega</div>
        <br>
        <div class="aisle-label">Pasillo</div>
        <ng-container *ngFor="let ubicacion of bodega.ubicaciones; let i = index">
          <div class="shelf-row-full">
            <div class="shelf-full" [class.has-inventory]="ubicacion.tiene_inventario" [class.no-inventory]="!ubicacion.tiene_inventario">
              <div class="ubicacion-nombre">{{ ubicacion.nombre }}</div>
              <div class="ubicacion-cantidad">Cantidad: {{ ubicacion.cantidad_disponible }}</div>
              <div class="ubicacion-desc">{{ ubicacion.descripcion }}</div>
              <div class="ubicacion-inv">{{ ubicacion.tiene_inventario ? 'Con inventario' : 'Sin inventario' }}</div>
            </div>
          </div>
        </ng-container>
        <div class="door">Ingreso a la bodega</div>
      </div>
    </div>
  `,
  styles: [`
    .bodega-map-container {
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .map-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .legend {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .legend-square.has-inventory { background: #4CAF50; }
    .legend-square.no-inventory { background: #F44336; }
    .warehouse-plan {
      border-radius: 16px 16px 30px 30px;
      box-shadow: 0 8px 24px #0002;
      margin: 0 auto;
      padding-bottom: 60px;
      border: 3px solid #b0a28a;
      overflow: hidden;
      position: relative;
      width: 100%;
      min-height: 360px;
      background: #f6f6f6;
    }
    .warehouse-walls {
      position: absolute;
      inset: 0;
      border: 3px solid #b0a28a;
      border-radius: 16px 16px 30px 30px;
      z-index: 1;
      pointer-events: none;
    }
    .warehouse-label {
      position: absolute;
      left: 50%;
      top: 6px;
      transform: translateX(-50%);
      font-size: 18px;
      font-weight: 600;
      color: #7d6b4a;
      text-shadow: 0 1px 0 #fff;
      letter-spacing: 1px;
      z-index: 3;
    }
    .aisle-label {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(-7deg);
      font-size: 16px;
      font-weight: 500;
      color: #b0a28a;
      opacity: 0.16;
      letter-spacing: 2.5px;
      z-index: 0;
      pointer-events: none;
    }
    .shelf-row-full {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin: 32px 0 0 0;
      position: relative;
      z-index: 2;
    }
    .shelf-row-full:first-child { margin-top: 55px; }
    .shelf-full {
      background: repeating-linear-gradient(90deg,#d9bfa3 0 10px,#fffbe9 10px 100%);
      border: 3px solid #b0a28a;
      border-radius: 10px;
      width: 85%;
      min-width: 220px;
      min-height: 54px;
      max-width: 900px;
      box-shadow: 0 2px 10px #0001;
      padding: 10px 24px 8px 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      margin-bottom: 0;
      z-index: 2;
      transition: box-shadow 0.18s, border 0.18s;
      gap: 28px;
    }
    .shelf-full.has-inventory { border-color: #4CAF50; background: repeating-linear-gradient(90deg,#e9fbe9 0 10px,#fffbe9 10px 100%); }
    .shelf-full.no-inventory { border-color: #F44336; background: repeating-linear-gradient(90deg,#ffeaea 0 10px,#fffbe9 10px 100%); }
    .shelf-full .ubicacion-nombre { font-weight: bold; font-size: 16px; color: #222; margin-right: 18px; }
    .shelf-full .ubicacion-cantidad { font-size: 13px; color: #555; margin-right: 18px; }
    .shelf-full .ubicacion-desc { font-size: 12px; color: #888; margin-right: 18px; }
    .shelf-full .ubicacion-inv { font-size: 12px; font-weight: 500; color: #4CAF50; }
    .shelf-full.no-inventory .ubicacion-inv { color: #F44336; }
    .door {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 320px;
      height: 22px;
      background:rgb(170, 136, 115);
      border: 3px solidrgb(252, 84, 37);
      border-radius: 0 0 14px 14px;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #fff;
      font-weight: 600;
      letter-spacing: 1px;
      box-shadow: 0 2px 7px #0003;
      margin: 0;
    }
    .shelf-row:first-child { margin-top: 40px; }
    .shelf {
      background: repeating-linear-gradient(90deg,#d9bfa3 0 8px,#fffbe9 8px 100%);
      border: 2.5px solid #b0a28a;
      border-radius: 6px;
      min-width: 120px;
      min-height: 64px;
      max-width: 185px;
      box-shadow: 0 2px 10px #0001;
      padding: 8px 10px 5px 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      margin-bottom: 0;
      z-index: 2;
      transition: box-shadow 0.18s;
    }
    .shelf.has-inventory { border-color: #4CAF50; background: repeating-linear-gradient(90deg,#e9fbe9 0 8px,#fffbe9 8px 100%); }
    .shelf.no-inventory { border-color: #F44336; background: repeating-linear-gradient(90deg,#ffeaea 0 8px,#fffbe9 8px 100%); }
    .shelf .ubicacion-nombre { font-weight: bold; font-size: 15px; color: #222; margin-bottom: 2px; }
    .shelf .ubicacion-cantidad { font-size: 13px; color: #555; margin-bottom: 2px; }
    .shelf .ubicacion-desc { font-size: 12px; color: #888; margin-bottom: 2px; }
    .shelf .ubicacion-inv { font-size: 12px; font-weight: 500; margin-top: 4px; color: #4CAF50; }
    .shelf.no-inventory .ubicacion-inv { color: #F44336; }
  `]
})
export class BodegaMapComponent {
  @Input() bodega!: { nombre: string, ubicaciones: Ubicacion[] };

  // Divide las ubicaciones en filas de estantes (máx 4 por fila)
  get shelfRows(): Ubicacion[][] {
    const perRow = 4;
    if (!this.bodega?.ubicaciones) return [];
    const rows: Ubicacion[][] = [];
    for (let i = 0; i < this.bodega.ubicaciones.length; i += perRow) {
      rows.push(this.bodega.ubicaciones.slice(i, i + perRow));
    }
    return rows;
  }
}