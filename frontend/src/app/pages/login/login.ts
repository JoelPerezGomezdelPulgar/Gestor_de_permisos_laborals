import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  masterSrv = inject(MasterService);
  loggerSrv = inject(LoggerService);
  router = inject(Router);
  errorMessage: string = '';

  mustChangePassword = false;
  newPassword = '';
  confirmPassword = '';

  onLogin() {
    const formValue = this.loginForm.value;
    this.masterSrv.onLogin(formValue).subscribe({
      next: (result: any) => {
        localStorage.setItem('username', result.username);
        localStorage.setItem('rol', result.rol);
        console.log(result.id);
        localStorage.setItem('id', result.id);
        if (result.mustChangePassword) {
          this.mustChangePassword = true;
        } else if (result.rol === 'admin') {
          this.router.navigateByUrl("/admin")
        } else {
          this.router.navigateByUrl('userDashboard');
          console.log('hola');
        }
      },
      error: (error: any) => {
        this.errorMessage = error.error?.msg || 'Error desconegut';
        this.loggerSrv.error('Login error', error);
      },
    });
  }

  onChangePassword() {
    if (!this.newPassword || this.newPassword.length < 6) {
      alert('La contrasenya ha de tenir almenys 6 caràcters');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Les contrasenyes no coincideixen');
      return;
    }
    this.masterSrv.changePassword(this.newPassword).subscribe({
      next: () => {
        this.mustChangePassword = false;
        const rol = localStorage.getItem('rol');
        if (rol === 'admin') {
          this.router.navigateByUrl("/admin")
        } else {
          this.router.navigateByUrl("/userDashboard")
        }
      },
      error: (err: any) => {
        alert(err.error?.msg || 'Error al canviar la contrasenya');
      }
    });
  }

}
