import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPurchasesPageComponent } from './my-purchases-page.component';

describe('MyPurchasesPageComponent', () => {
  let component: MyPurchasesPageComponent;
  let fixture: ComponentFixture<MyPurchasesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPurchasesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPurchasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
