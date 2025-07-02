import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsInformationComponent } from './kids-information.component';

describe('KidsInformationComponent', () => {
  let component: KidsInformationComponent;
  let fixture: ComponentFixture<KidsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
