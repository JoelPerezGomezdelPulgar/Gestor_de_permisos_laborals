import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { LoggerService } from '../../service/logger.service';
import { MasterService } from '../../service/master-service';

@Component({
  selector: 'app-lobby',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css'
})
export class Lobby implements OnInit {
  public sidebarCollapsed = false;
  public sidebarHidden = false;
  public username = '';
  public role = '';

  public router = inject(Router);
  public isHome: boolean = false;
  private loggerSrv = inject(LoggerService);
  private masterSrv = inject(MasterService);

  private checkHome() {
    this.isHome = (this.router.url === '/' || this.router.url === '/lobby');
  }

  ngOnInit(): void {
    this.checkHome();
    // Re-check on every navigation
    this.router.events.subscribe(() => {
      this.checkHome();
    });

    this.masterSrv.getMe().subscribe({
      next: (res: any) => {
        this.loggerSrv.info("User data from server", res);
        this.username = res.username || res.userName;
        this.role = res.rol || res.role;
      },
      error: (err) => {
        this.loggerSrv.warn("User not logged in or session expired", err);
        this.username = '';
        this.role = '';
      }
    });
  }

  toggleSidebar(): void {
    // Toggle visibility: add/remove `hidden` on the sidebar and adjust navbar shifted state
    this.sidebarHidden = !this.sidebarHidden;
    const el = document.getElementById('sidebar');
    if (el) {
      if (this.sidebarHidden) el.classList.add('hidden');
      else el.classList.remove('hidden');
    }
    const nav = document.querySelector('.navbar');
    if (nav) {
      if (!this.sidebarHidden) nav.classList.add('shifted');
      else nav.classList.remove('shifted');
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.masterSrv.logout().subscribe({
      next: () => {
        this.username = '';
        this.role = '';
        this.router.navigate(['']);
      },
      error: (e) => {
        this.loggerSrv.error("Logout error", e);
        this.router.navigate(['']); // Navigate anyway
      }
    });
  }
}
