import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5100', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
  }

  onPermisoChanged(): Observable<void> {
    return new Observable(observer => {
      this.socket.on('permiso:changed', () => {
        observer.next();
      });
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
