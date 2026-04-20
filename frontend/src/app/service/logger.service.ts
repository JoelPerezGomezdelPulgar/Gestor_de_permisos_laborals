import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private apiUrl = 'http://localhost:5100/api/logs';
    http = inject(HttpClient);

    info(message: string, details?: any) {
        console.log(`[INFO] ${message}`, details);
        this.sendToServer('info', message, details);
    }

    warn(message: string, details?: any) {
        console.warn(`[WARN] ${message}`, details);
        this.sendToServer('warn', message, details);
    }

    error(message: string, details?: any) {
        console.error(`[ERROR] ${message}`, details);
        this.sendToServer('error', message, details);
    }

    private sendToServer(level: string, message: string, details?: any) {
        const payload = { level, message, details };
        this.http.post(this.apiUrl, payload).subscribe({
            error: (err) => console.error('Failed to send log to server', err)
        });
    }
}
