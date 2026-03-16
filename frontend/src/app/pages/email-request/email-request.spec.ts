import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRequest } from './email-request';

describe('EmailRequest', () => {
  let component: EmailRequest;
  let fixture: ComponentFixture<EmailRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
