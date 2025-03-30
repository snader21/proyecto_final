/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from '../../services/alert.service';

import { FabricantesComponent } from './fabricantes.component';

describe('FabricantesComponent', () => {
  let component: FabricantesComponent;
  let fixture: ComponentFixture<FabricantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FabricantesComponent ],
      providers: [
        ConfirmationService,
        AlertService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
