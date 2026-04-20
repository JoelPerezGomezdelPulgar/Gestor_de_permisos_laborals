import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { LoggerService } from '../../service/logger.service';

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

  private checkHome() {
    this.isHome = (this.router.url === '/' || this.router.url === '/lobby');
  }

  ngOnInit(): void {
    this.checkHome();
    // Re-check on every navigation
    this.router.events.subscribe(() => {
      this.checkHome();
    });

    // Try common storage keys for username; fall back to 'Admin'
    const localData = localStorage.getItem('leaveUser')
    this.loggerSrv.info("Lobby localStorage data", localData);
    if (localData != null) {
      const parseObj = JSON.parse(localData);
      this.loggerSrv.info("Parsed Lobby data", parseObj);
      this.username = parseObj.username || parseObj.userName;
      this.role = parseObj.rol || parseObj.role;
      this.loggerSrv.info("Current role in Lobby", this.role);
    }
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
    try {
      localStorage.removeItem('leaveUser');
      this.username = '';
      this.role = '';
    } catch (e) {
    }
    this.router.navigate(['']);
  }
}
