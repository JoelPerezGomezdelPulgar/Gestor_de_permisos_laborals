import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  })

  masterSrv = inject(MasterService);
  router = inject(Router);

  onLogin() {
    const formValue = this.loginForm.value;
    this.masterSrv.onLogin(formValue).subscribe({
      next: (result: any) => {
        localStorage.setItem('leaveUser', JSON.stringify(result));
        if (result.rol == 'admin') {
          this.router.navigateByUrl("admin")
        } else {
          this.router.navigateByUrl("user")
        }
      },
      error: (error: any) => {
        alert(error.error.message)
        console.log(error)
      }
    })
  }
}
