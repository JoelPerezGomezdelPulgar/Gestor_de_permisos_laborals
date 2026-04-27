import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';

@Component({
  selector: 'app-user-peticio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-peticio.html',
  styleUrl: './user-peticio.css'
})
export class UserPeticio implements OnInit {
  masterSrv = inject(MasterService);
  loggerSrv = inject(LoggerService);
  router = inject(Router);

  peticioForm: FormGroup = new FormGroup({
    dataInici: new FormControl('', [Validators.required]),
    dataFinal: new FormControl('', [Validators.required]),
    tipus: new FormControl('vacances', [Validators.required]),
    descripcio: new FormControl('', [Validators.required])
  });

  tipusPermisos = ['hospitalitzacio', 'matrimoni', 'trasllat', 'malaltia', 'naixement', 'vacances', 'altres'];
  currentUser: any = null;

  ngOnInit() {
    this.masterSrv.getMe().subscribe({
      next: (res: any) => {
        this.currentUser = res;
      },
      error: (err) => {
        this.loggerSrv?.error("Session error in peticio", err);
        this.router.navigateByUrl('login');
      }
    });

    const today = new Date().toISOString().split('T')[0];
    this.peticioForm.patchValue({
      dataInici: today,
      dataFinal: today
    });
  }

  onSubmit() {
    if (this.peticioForm.invalid) return;

    const formValue = this.peticioForm.value;
    const peticioData = {
      ...formValue,
      empId: this.currentUser._id,
      estat: 'pendent'
    };

    this.masterSrv.createPermisos(peticioData).subscribe({
      next: () => {
        alert('Petició enviada correctament');
        this.router.navigateByUrl('userDashboard');
      },
      error: (err: any) => {
        alert('Error en enviar la petició: ' + (err.error?.message || err.message));
      }
    });
  }
}
