
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

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

  logout(): void {
    // Clear common auth keys and redirect to login
    try {
      localStorage.removeItem('leaveUser');
      // if your app uses a different key, update accordingly
      // optionally clear everything: localStorage.clear();
    } catch (e) {
      // ignore
    }
    this.router.navigate(['/login']);
  }
}
