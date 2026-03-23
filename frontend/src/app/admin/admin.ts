import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  // Mock data for initial presentation
  users = [
    { nom: 'Joel Pérez', email: 'joel@example.com', username: 'jperez', rol: 'admin' },
    { nom: 'Anna Garcia', email: 'anna@example.com', username: 'agarcia', rol: 'usuari' }
  ];

  permissionRequests = [
    { empleat: 'Anna Garcia', tipus: 'Assumptes Propris', dataInici: '12/04/2026', estat: 'Pendent' },
    { empleat: 'Marçal Soler', tipus: 'Vacances', dataInici: '05/04/2026', estat: 'Aprovat' }
  ];

  ngOnInit() {
    // Data loading logic will go here
  }
}
