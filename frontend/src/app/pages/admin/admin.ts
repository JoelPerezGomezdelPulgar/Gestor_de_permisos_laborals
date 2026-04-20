import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

  router = inject(Router);
  masterSrv = inject(MasterService);
  loggerSrv = inject(LoggerService);

  // Stats counts
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;

  users: any[] = [];
  permissionRequests: any[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.masterSrv.getDashboardData().subscribe({
      next: (res: any) => {
        this.pendingCount = res.stats.pendent;
        this.approvedCount = res.stats.aprovat;
        this.rejectedCount = res.stats.refusat;
        this.users = res.recentUsers;
        this.permissionRequests = res.recentPermissions;
      },
      error: (err) => this.loggerSrv.error("Error loading dashboard data", err)
    });
  }

  onDeleteUser(id: string, name: string) {
    if (confirm(`Estàs segur que vols borrar a ${name}?`)) {
      this.masterSrv.deleteUser(id).subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err) => alert("Error al eliminar usuari: " + err.message)
      });
    }
  }

  onUpdatePermissionStatus(permission: any, newStatus: string) {
    const updatedPermiso = { ...permission, estat: newStatus };
    // The API expects ID and full object (or at least the fields to change)
    // If empId is populated, we need to send just the ID
    if (updatedPermiso.empId && typeof updatedPermiso.empId === 'object') {
      updatedPermiso.empId = updatedPermiso.empId._id;
    }

    this.masterSrv.updatePermisos(permission._id, updatedPermiso).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err) => alert("Error al actualizar permís: " + err.message)
    });
  }

  goToUsers() {
    this.router.navigate(['/user']);
  }

  goToPermissions() {
    this.router.navigate(['/permisos']);
  }
}
