import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { MasterService } from '../../service/master-service';

@Component({
  selector: 'app-header',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  public sidebarCollapsed = false;
  public sidebarHidden = false;
  public username = '';
  public role = '';

  private masterSrv = inject(MasterService);
  private router = inject(Router);

  ngOnInit(): void {
    this.masterSrv.getMe().subscribe({
      next: (res: any) => {
        this.username = res.username || res.userName;
        this.role = res.rol || res.role;
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

  logout(): void {
    this.masterSrv.logout().subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        this.router.navigate(['']);
      }
    });
  }
}
