import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../service/logger.service';
import { Router } from '@angular/router';
import { MasterService } from '../../service/master-service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {
  masterSrv = inject(MasterService);
  loggerSrv = inject(LoggerService);
  router = inject(Router);

  currentUser: any = null;
  userPermissions: any[] = [];

  // Stats
  totalRequests = 0;
  pendingRequests = 0;
  approvedRequests = 0;

  ngOnInit() {
    const userData = localStorage.getItem('leaveUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadUserPermissions();
    } else {
      this.router.navigateByUrl('login');
    }
  }

  loadUserPermissions() {
    this.masterSrv.getPermisos().subscribe({
      next: (res: any[]) => {
        // Filter permissions for the current user
        // Note: res is populated with empId object
        this.userPermissions = res.filter(p => p.empId?._id === this.currentUser._id);
        this.calculateStats();
      },
      error: (err) => this.loggerSrv.error("Error loading permissions", err)
    });
  }

  calculateStats() {
    this.totalRequests = this.userPermissions.length;
    this.pendingRequests = this.userPermissions.filter(p => p.estat === 'pendent').length;
    this.approvedRequests = this.userPermissions.filter(p => p.estat === 'aprovat').length;
  }

  goToNewPeticio() {
    this.router.navigateByUrl('userPeticio');
  }
}
