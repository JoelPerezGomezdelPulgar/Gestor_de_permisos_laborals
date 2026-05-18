import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
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

  onLogin() {
    const formValue = this.loginForm.value;
    this.masterSrv.onLogin(formValue).subscribe({
      next: (result: any) => {
        localStorage.setItem('username', result.username);
        localStorage.setItem('rol', result.rol);
<<<<<<< HEAD
        console.log(result.id);
        localStorage.setItem('id', result.id);
        if (result.rol === 'admin') {
          this.router.navigateByUrl('admin');
          console.log('Viaje fallido');
        } else {
          this.router.navigateByUrl('userDashboard');
          console.log('hola');
        }
      },
      error: (error: any) => {
        this.errorMessage = error.message;
=======
        localStorage.setItem('id', result.id);
        if (result.rol === 'admin') {
          this.router.navigateByUrl("/admin")
        } else {
          this.router.navigateByUrl("/userDashboard")
        }
      },
      error: (error: any) => {
        const errorMessage = error.error?.msg || error.error?.message || 'Error en el login';
        alert(errorMessage);
>>>>>>> a9a9a7936e0c00ed670b7fb3c32f95d0500d4e68
        this.loggerSrv.error('Login error', error);
      },
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
