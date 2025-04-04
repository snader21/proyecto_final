/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { AlertService } from "../../../services/alert.service";

import { VendedoresFormComponent } from "./vendedores-form.component";

describe("VendedoresFormComponent", () => {
  let component: VendedoresFormComponent;
  let fixture: ComponentFixture<VendedoresFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VendedoresFormComponent],
      providers: [ConfirmationService, AlertService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedoresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
