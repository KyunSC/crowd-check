import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymButton } from './gym-button';

describe('GymButton', () => {
  let component: GymButton;
  let fixture: ComponentFixture<GymButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
