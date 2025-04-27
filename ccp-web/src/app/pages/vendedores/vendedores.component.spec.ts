/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmationService } from "primeng/api";
import { AlertService } from "../../services/alert.service";

import { VendedoresComponent } from "./vendedores.component";

describe("VendedoresComponent", () => {
  let component: VendedoresComponent;
  let fixture: ComponentFixture<VendedoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VendedoresComponent],
      providers: [ConfirmationService, AlertService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
