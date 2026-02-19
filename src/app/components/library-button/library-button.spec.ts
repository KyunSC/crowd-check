import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryButton } from './library-button';

describe('LibraryButton', () => {
  let component: LibraryButton;
  let fixture: ComponentFixture<LibraryButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
