/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FabricantesFormComponent } from './fabricantes-form.component';

describe('FabricantesFormComponent', () => {
  let component: FabricantesFormComponent;
  let fixture: ComponentFixture<FabricantesFormComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ FabricantesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricantesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
