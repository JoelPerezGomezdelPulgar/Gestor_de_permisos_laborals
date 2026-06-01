import {Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  router = inject(Router);
  masterSrv = inject(MasterService);
  loggerSrv = inject(LoggerService);

  role = '';

  // Admin-specific
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;
  users: any[] = [];
  permissionRequests: any[] = [];
  myChart: any;

  // User-specific (stats only)
  userId: string | null = null;
  userName: string | null = null;
  totalUserRequests = 0;
  pendingUserRequests = 0;
  approvedUserRequests = 0;
  rejectedUserRequests = 0;
  myChartUser: any;

  ngOnInit() {
    this.role = localStorage.getItem('rol') || '';
    this.userId = localStorage.getItem('id');
    this.userName = localStorage.getItem('username');

    if (this.role === 'admin') {
      this.loadDashboardData();
    } else {
      this.loadUserStats();
    }
  }

  // ── Admin methods ──

  loadDashboardData() {
    this.masterSrv.getDashboardData().subscribe({
      next: (res: any) => {
        this.pendingCount = res.stats.pendent;
        this.approvedCount = res.stats.aprovat;
        this.rejectedCount = res.stats.refusat;
        this.users = res.recentUsers;
        this.permissionRequests = res.recentPermissions;
        this.renderChart();
      },
      error: (err) => this.loggerSrv.error("Error loading dashboard data", err)
    });
  }

  renderChart() {
    const ctx = document.getElementById('miGrafico') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pendents', 'Aprovats', 'Rebutjats'],
        datasets: [{
          label: 'Permisos laborals',
          data: [this.pendingCount, this.approvedCount, this.rejectedCount],
          backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }

  onDeleteUser(id: string, name: string): void {
    if (confirm(`Estàs segur que vols borrar a ${name}?`)) {
      this.masterSrv?.deleteUser(id).subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err: any) => alert("Error al eliminar usuari: " + err.message)
      });
    }
  }

  onUpdatePermissionStatus(permission: any, newStatus: string): void {
    const updatedPermiso = { ...permission, estat: newStatus };

    if (updatedPermiso.empId && typeof updatedPermiso.empId === 'object') {
      updatedPermiso.empId = updatedPermiso.empId._id;
    }

    this.masterSrv?.updatePermisos(permission._id, updatedPermiso).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err: any) => alert("Error al actualitzar permís: " + err.message)
    });
  }

  goToUsers(): void {
    this.router?.navigate(['/user']);
  }

  goToPermissions(): void {
    this.router?.navigate(['/permisos']);
  }

  // ── User methods (stats only) ──

  loadUserStats() {
    this.masterSrv.getPermisosByUserId(this.userId!).subscribe({
      next: (res: any[]) => {
        this.totalUserRequests = res.length;
        this.pendingUserRequests = res.filter(p => p.estat === 'pendent').length;
        this.approvedUserRequests = res.filter(p => p.estat === 'aprovat').length;
        this.rejectedUserRequests = res.filter(p => p.estat === 'refusat').length;
        setTimeout(() => this.renderUserChart(), 0);
      },
      error: (err) => this.loggerSrv.error("Error loading permissions", err)
    });
  }

  renderUserChart() {
    const ctx = document.getElementById('miGraficoUser') as HTMLCanvasElement;
    if (!ctx) return;
    if (this.myChartUser) {
      this.myChartUser.destroy();
    }
    this.myChartUser = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pendents', 'Aprovats', 'Rebutjats'],
        datasets: [{
          label: 'Els meus permisos',
          data: [this.pendingUserRequests, this.approvedUserRequests, this.rejectedUserRequests],
          backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }
}
