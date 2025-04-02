import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductBulkComponent } from './manage-product-bulk.component';

describe('ManageProductBulkComponent', () => {
  let component: ManageProductBulkComponent;
  let fixture: ComponentFixture<ManageProductBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductBulkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
