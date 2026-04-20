import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPeticio } from './user-peticio';

describe('UserPeticio', () => {
  let component: UserPeticio;
  let fixture: ComponentFixture<UserPeticio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPeticio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPeticio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
