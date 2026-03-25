import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBasic } from './user-basic';

describe('UserBasic', () => {
  let component: UserBasic;
  let fixture: ComponentFixture<UserBasic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBasic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBasic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
