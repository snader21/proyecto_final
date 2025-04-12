import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosRegistroPage } from './pedidos-registro.page';

describe('PedidosRegistroPage', () => {
  let component: PedidosRegistroPage;
  let fixture: ComponentFixture<PedidosRegistroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosRegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
