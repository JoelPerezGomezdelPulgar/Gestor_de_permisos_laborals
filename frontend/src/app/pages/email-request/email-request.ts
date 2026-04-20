import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../service/logger.service';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { EmailService } from '../../service/email-service';

@Component({
  selector: 'app-email-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './email-request.html',
  styleUrl: './email-request.css',
})

export class EmailRequest {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(""),
  })

  masterSrv = inject(MasterService);
  loggerSrv = inject(LoggerService);
  emailSrv = inject(EmailService);
  router = inject(Router);

  onEmail() {
    const emailValue = this.loginForm.value.email?.trim();

    if (!emailValue) {
      alert("Si us plau, introdueix un correu.");
      return;
    }

    const datos = {
      email: emailValue
    };

    this.emailSrv.sendEmail(datos).subscribe({
      next: (res) => {
        this.loggerSrv.info('¡Correo enviado!', res);
        alert('Revisa la teva bústia de entrada.');
        this.router.navigateByUrl("login");
      },
      error: (err) => {
        this.loggerSrv.error('Error desde el servidor', err);
        alert('No s\'ha pogut enviar el correu. Verifica si l\'usuari existeix.');
      }
    });
  }
}
