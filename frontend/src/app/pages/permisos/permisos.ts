import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';
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
  loggerSrv = inject(LoggerService);
  router = inject(Router);

  role = '';
  userId: string | null = null;

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

  permisosTypes: any[] = [];
  estatTypes = ['pendent', 'aprovat', 'refusat'];

  searchText = '';
  sortBy = '';
  sortDir: 'asc' | 'desc' = 'asc';
  filterTipus = '';
  filterEstat = '';
  filterDateFrom = '';
  filterDateTo = '';

  permisosToDelete: any = null;
  confirmPermisosname = '';

  ngOnInit() {
    this.role = localStorage.getItem('rol') || '';
    this.userId = localStorage.getItem('id');
    this.loadTipusPermisos();
    if (this.role === 'admin') {
      this.loadUsers();
      this.loadPermisos();
    } else {
      this.loadUserPermisos();
    }
  }

  get filteredPermisos() {
    let list = [...this.permisosList];

    if (this.searchText) {
      const q = this.searchText.toLowerCase();
      if (this.role === 'admin') {
        list = list.filter(p =>
          `${p.empId?.nom} ${p.empId?.cognom1} ${p.empId?.cognom2}`.toLowerCase().includes(q) ||
          p.tipus?.toLowerCase().includes(q) ||
          p.descripcio?.toLowerCase().includes(q)
        );
      } else {
        list = list.filter(p =>
          p.tipus?.toLowerCase().includes(q) ||
          p.descripcio?.toLowerCase().includes(q)
        );
      }
    }

    if (this.filterTipus) {
      list = list.filter(p => p.tipus === this.filterTipus);
    }

    if (this.filterEstat) {
      list = list.filter(p => p.estat === this.filterEstat);
    }

    if (this.filterDateFrom) {
      const from = new Date(this.filterDateFrom);
      list = list.filter(p => new Date(p.dataInici) >= from);
    }
    if (this.filterDateTo) {
      const to = new Date(this.filterDateTo);
      list = list.filter(p => new Date(p.dataInici) <= to);
    }

    if (this.role === 'admin' && this.sortBy === 'name') {
      list.sort((a, b) => {
        const aName = `${a.empId?.nom} ${a.empId?.cognom1}`.toLowerCase();
        const bName = `${b.empId?.nom} ${b.empId?.cognom1}`.toLowerCase();
        return this.sortDir === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      });
    } else if (this.sortBy === 'type') {
      list.sort((a, b) => {
        return this.sortDir === 'asc'
          ? a.tipus?.localeCompare(b.tipus)
          : b.tipus?.localeCompare(a.tipus);
      });
    } else if (this.sortBy === 'date') {
      list.sort((a, b) => {
        const aDate = new Date(a.createdAt || a.dataInici).getTime();
        const bDate = new Date(b.createdAt || b.dataInici).getTime();
        return this.sortDir === 'asc' ? aDate - bDate : bDate - aDate;
      });
    }

    return list;
  }

  toggleSort(field: string) {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
  }

  clearFilters() {
    this.searchText = '';
    this.sortBy = '';
    this.sortDir = 'asc';
    this.filterTipus = '';
    this.filterEstat = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
  }

  loadUserPermisos() {
    this.masterSrv.getPermisosByUserId(this.userId!).subscribe({
      next: (res: any[]) => {
        this.permisosList = res;
      },
      error: (err) => this.loggerSrv.error("Error loading permissions", err)
    });
  }

  loadTipusPermisos() {
    this.masterSrv.getTipusPermisos().subscribe({
      next: (res: any) => {
        this.permisosTypes = res;
      },
      error: (err) => this.loggerSrv.error("Error loading tipus permisos", err)
    });
  }
  
  loadPermisos() {
    this.masterSrv.getPermisos().subscribe({
      next: (res: any) => {
        this.permisosList = res;
      },
      error: (err) => this.loggerSrv.error("Error loading permisos", err)
    });
  }

  loadUsers() {
    this.masterSrv.getUsers().subscribe({
      next: (res: any) => {
        this.usersList = res;
      },
      error: (err) => this.loggerSrv.error("Error loading users", err)
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
    if (this.role !== 'admin') {
      this.permisosForm.patchValue({ empId: this.userId });
    }
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
          this.reloadPermisos();
          this.closeModals();
        },
        error: (err) => alert("Error al actualizar el permiso: " + err.message)
      });
    } else {
      this.masterSrv.createPermisos(data).subscribe({
        next: () => {
          this.reloadPermisos();
          this.closeModals();
        },
        error: (err) => alert("Error al crear el permiso: " + err.message)
      });
    }
  }

  private reloadPermisos() {
    if (this.role === 'admin') {
      this.loadPermisos();
    } else {
      this.loadUserPermisos();
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
