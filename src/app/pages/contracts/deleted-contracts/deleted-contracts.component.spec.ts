import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedContractsComponent } from './deleted-contracts.component';

describe('DeletedContractsComponent', () => {
  let component: DeletedContractsComponent;
  let fixture: ComponentFixture<DeletedContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedContractsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
