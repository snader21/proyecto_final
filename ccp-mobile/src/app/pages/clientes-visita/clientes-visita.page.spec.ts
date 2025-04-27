import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesVisitaPage } from './clientes-visita.page';

describe('ClientesVisitaPage', () => {
  let component: ClientesVisitaPage;
  let fixture: ComponentFixture<ClientesVisitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesVisitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
