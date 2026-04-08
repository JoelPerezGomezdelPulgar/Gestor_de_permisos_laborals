import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../service/master-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './permisos.html',
  styleUrl: './permisos.css',
})
export class Permisos implements OnInit {
  masterSrv = inject(MasterService);
  permisosList: any[] = [];
  usersList: any[] = [];

  showFormModal = false;
  showDeleteModal = false;
  isEditMode = false;

  permisosForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    empId: new FormControl('', [Validators.required]),
    dataInici: new FormControl('', [Validators.required]),
    dataFinal: new FormControl('', [Validators.required]),
    tipus: new FormControl('vacances', [Validators.required]),
    descripcio: new FormControl('', [Validators.required]),
    estat: new FormControl('pendent', [Validators.required]),
  });

  permisosTypes = ['hospitalitzacio', 'matrimoni', 'trasllat', 'malaltia', 'naixement', 'vacances', 'altres'];
  estatTypes = ['pendent', 'aprovat', 'refusat'];

  permisosToDelete: any = null;
  confirmPermisosname = ''; // We'll use this for confirming the employee name or something else

  ngOnInit() {
    this.loadUsers();
    this.loadPermisos();
  }

  loadUsers() {
    this.masterSrv.getUsers().subscribe({
      next: (res: any) => {
        this.usersList = res;
      },
      error: (err) => console.error("Error loading users:", err)
    });
  }

  loadPermisos() {
    this.masterSrv.getPermisos().subscribe({
      next: (res: any) => {
        this.permisosList = res;
      },
      error: (err) => console.error("Error loading permisos:", err)
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.permisosForm.reset({
      tipus: 'vacances',
      estat: 'pendent',
      dataInici: new Date().toISOString().split('T')[0],
      dataFinal: new Date().toISOString().split('T')[0]
    });
    this.showFormModal = true;
  }

  openEditModal(permisos: any) {
    this.isEditMode = true;
    // Map data for the form. If empId is populated, we need the ID
    const formData = {
      ...permisos,
      empId: permisos.empId?._id || permisos.empId,
      dataInici: permisos.dataInici ? new Date(permisos.dataInici).toISOString().split('T')[0] : '',
      dataFinal: permisos.dataFinal ? new Date(permisos.dataFinal).toISOString().split('T')[0] : ''
    };
    this.permisosForm.patchValue(formData);
    this.showFormModal = true;
  }

  closeModals() {
    this.showFormModal = false;
    this.showDeleteModal = false;
    this.permisosToDelete = null;
    this.confirmPermisosname = '';
  }

  savePermisos() {
    if (this.permisosForm.invalid) return;

    const data = this.permisosForm.value;

    if (this.isEditMode) {
      this.masterSrv.updatePermisos(data._id, data).subscribe({
        next: () => {
          this.loadPermisos();
          this.closeModals();
        },
        error: (err) => alert("Error al actualizar el permiso: " + err.message)
      });
    } else {
      this.masterSrv.createPermisos(data).subscribe({
        next: () => {
          this.loadPermisos();
          this.closeModals();
        },
        error: (err) => alert("Error al crear el permiso: " + err.message)
      });
    }
  }

  openDeleteModal(permisos: any) {
    this.permisosToDelete = permisos;
    // For confirmation, we'll ask for the employee name
    this.confirmPermisosname = '';
    this.showDeleteModal = true;
  }

  confirmDelete() {
    const expectedName = this.permisosToDelete.empId?.nom || 'CONFIRMAR';
    if (this.confirmPermisosname !== expectedName) return;

    this.masterSrv.deletePermisos(this.permisosToDelete._id).subscribe({
      next: () => {
        this.loadPermisos();
        this.closeModals();
      },
      error: (err) => alert("Error al eliminar el permiso: " + err.message)
    });
  }
}
