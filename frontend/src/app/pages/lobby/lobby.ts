import { AfterViewChecked, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { LoggerService } from '../../service/logger.service';
import { MasterService } from '../../service/master-service';


@Component({
  selector: 'app-lobby',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css'
})
export class Lobby implements OnInit, AfterViewChecked {
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
  ngAfterViewChecked(): void {
    
  }

  ngOnInit(): void {
    this.checkHome();
    // Re-check on every navigation
    this.router.events.subscribe(() => {
      this.checkHome();
  });


    
    this.username = localStorage.getItem('username') || '';
    this.role = localStorage.getItem('rol') || '';
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
