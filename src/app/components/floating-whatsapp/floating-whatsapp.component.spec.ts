import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingWhatsappComponent } from './floating-whatsapp.component';

describe('FloatingWhatsappComponent', () => {
  let component: FloatingWhatsappComponent;
  let fixture: ComponentFixture<FloatingWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingWhatsappComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
