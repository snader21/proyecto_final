import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutaDetailPage } from './ruta-detail.page';

describe('RutaDetailPage', () => {
  let component: RutaDetailPage;
  let fixture: ComponentFixture<RutaDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
