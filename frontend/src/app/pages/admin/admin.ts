import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';

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
      error: (err) => console.error("Error loading dashboard data:", err)
    });
  }

  goToUsers() {
    this.router.navigate(['/user']);
  }

  goToPermissions() {
    this.router.navigate(['/balance']);
  }
}
