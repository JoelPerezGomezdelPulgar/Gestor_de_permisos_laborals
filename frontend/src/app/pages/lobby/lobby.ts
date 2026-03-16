
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Try common storage keys for username; fall back to 'Admin'
    const localData = localStorage.getItem('leaveUser')
    if (localData != null) {
      const parseObj = JSON.parse(localData);
      this.username = parseObj.userName;
      this.role = parseObj.role;
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
    } catch (e) {
    }
    this.router.navigate(['/login']);
  }
}
