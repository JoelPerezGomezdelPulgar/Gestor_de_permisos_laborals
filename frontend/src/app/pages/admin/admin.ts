import {Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';
import { LoggerService } from '../../service/logger.service';
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})


export class Admin implements OnInit {
  router = inject(Router);
  masterSrv = inject(MasterService);
  loggerSrv = inject(LoggerService);

  // Stats counts
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;

  users: any[] = [];
  permissionRequests: any[] = [];
  
  // Guardamos la instancia del chart para poder destruirlo si actualizamos datos
  myChart: any;

  ngOnInit() {
    this.loadDashboardData();
  }

  // Eliminamos ngAfterViewInit porque vamos a renderizar cuando lleguen los datos
  
  loadDashboardData() {
    this.masterSrv.getDashboardData().subscribe({
      next: (res: any) => {
        this.pendingCount = res.stats.pendent;
        this.approvedCount = res.stats.aprovat;
        this.rejectedCount = res.stats.refusat;
        this.users = res.recentUsers;
        this.permissionRequests = res.recentPermissions;

        // ¡ESTA ES LA CLAVE! Renderizamos solo cuando tenemos los números
        this.renderChart();
      },
      error: (err) => this.loggerSrv.error("Error loading dashboard data", err)
    });
  }

  renderChart() {
    const ctx = document.getElementById('miGrafico') as HTMLCanvasElement;
    if (!ctx) return;

    // Si ya existía un gráfico, lo destruimos antes de crear uno nuevo 
    // (si no, verás errores en la consola al borrar usuarios o actualizar)
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
          // Colores que peguen con tu diseño oscuro
          backgroundColor: ['#f59e0b', '#10b981', '#ef4444'], 
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y', // <--- ESTO LO HACE HORIZONTAL
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false } // Menos ruido visual
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }
  
  ngAfterViewInit() {
    this.renderChart();
  }

  onDeleteUser(id: string, name: string): void {
    if (confirm(`Estàs segur que vols borrar a ${name}?`)) {
      // Usamos el operador opcional ?. o aseguramos que existe
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
      error: (err: any) => alert("Error al actualizar permís: " + err.message)
    });
  }

  goToUsers(): void {
    this.router?.navigate(['/user']);
  }

  goToPermissions(): void {
    this.router?.navigate(['/permisos']);
  }

}
