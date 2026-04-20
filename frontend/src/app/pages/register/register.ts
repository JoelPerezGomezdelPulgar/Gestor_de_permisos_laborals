import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register {
    masterSrv = inject(MasterService);
    loggerSrv = inject(LoggerService);
    router = inject(Router);

    registerForm: FormGroup = new FormGroup({
        nom: new FormControl('', [Validators.required]),
        cognom1: new FormControl('', [Validators.required]),
        cognom2: new FormControl(''),
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    selectedFile: File | null = null;
    loading = false;

    onFileSelected(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
        }
    }

    onRegister() {
        if (this.registerForm.invalid) {
            alert("Por favor, rellena todos los campos obligatorios correctly.");
            return;
        }

        this.loading = true;
        const formValue = this.registerForm.value;
        const formData = new FormData();

        Object.keys(formValue).forEach(key => {
            formData.append(key, formValue[key]);
        });

        if (this.selectedFile) {
            formData.append('imatge', this.selectedFile);
        }

        this.masterSrv.onRegister(formData).subscribe({
            next: (result: any) => {
                alert("Registro completado con éxito. Ahora puedes iniciar sesión.");
                this.router.navigateByUrl("login");
            },
            error: (error: any) => {
                this.loading = false;
                alert(error.error?.message || "Error al registrarse");
                this.loggerSrv.error('Register error', error);
            }
        });
    }
}
