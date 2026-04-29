# Historial Total de Cambios - Proyecto Gestor de Permisos Laborales

Este documento detalla todas las modificaciones realizadas para la migración a cookies HTTPOnly, implementación de seguridad con Bcrypt y el sistema de Refresh Token.

## RESUMEN DE CAMBIOS POR ARCHIVO

### BACKEND

#### 1. [.env](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/backend/.env)
- **Cambio**: Adición de `JWT_REFRESH_SECRET` para firmar los tokens de actualización.
- **Línea**: ~8

#### 2. [server.js](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/backend/server.js)
- **Cambio**: Importación y uso de `cookie-parser`. Configuración de CORS con `credentials: true`.
- **Líneas**: 2-3 (import), 18-25 (configuración de middleware).

#### 3. [helpers/autentication.js](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/backend/helpers/autentication.js)
- **Cambio**: Extracción de token desde `req.cookies`. Implementación de `generarRefreshToken` y `verificarRefreshToken`.
- **Líneas**: 10-12 (generarRefreshToken), 17 (extracción de cookie), 32-40 (verificarRefreshToken).

#### 4. [schemas/users.js](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/backend/schemas/users.js)
- **Cambio**: Añadido campo `refreshToken` al esquema de usuario.
- **Líneas**: 46-49.

#### 5. [crud/users.js](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/backend/crud/users.js)
- **Cambio**: 
    - Implementación de **Bcrypt** para hashing de contraseñas en `register`, `create` y `update`.
    - Envío de cookies `token` y `refreshToken` en `login` y `register`.
    - Limpieza de cookies en `logout`.
    - Creación del método `renewToken` para renovar el acceso mediante el refresh token.
    - Creación de `getMe` para retornar el perfil del usuario logueado.
- **Líneas**: 5 (import bcrypt), 44-54 (bcrypt en register), 120-152 (mejoras en login), 154-157 (logout con clearCookie), 168-185 (método renewToken).

#### 6. [routes/admin.js](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/backend/routes/admin.js)
- **Cambio**: Registro de nuevas rutas `/me`, `/logout` y `/refresh-token`.
- **Líneas**: 14-16.

---

### FRONTEND

#### 1. [app.config.ts](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/frontend/src/app/app.config.ts)
- **Cambio**: Registro del interceptor de autenticación global en el `HttpClient`.
- **Líneas**: 5, 12 (withInterceptors).

#### 2. [service/master-service.ts](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/frontend/src/app/service/master-service.ts)
- **Cambio**: Configuración de `withCredentials: true` en todas las peticiones. Eliminación del envío manual del token en los headers. Añadido método `renewToken()`.
- **Líneas**: 12 (httpOptions), 15-63 (uso de httpOptions), 29-31 (método renewToken).

#### 3. [guards/auth.guard.ts](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/frontend/src/app/guards/auth.guard.ts) y [admin.guard.ts](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/frontend/src/app/guards/admin.guard.ts)
- **Cambio**: Conversión de guards síncronos (que usaban `localStorage`) a guards asíncronos que validan la sesión llamando a `/api/me`.
- **Archivo completo** refactorizado.

#### 4. [interceptors/auth.interceptor.ts](file:///c:/2%20DAW/Projectos/Gestor_de_permisos_laborals/frontend/src/app/interceptors/auth.interceptor.ts)
- **Cambio**: [NUEVO] Lógica para interceptar errores 401 y disparar automáticamente el flujo de refresco de token.
- **Archivo completo** (creado nuevo).

#### 5. Componentes de UI (Header, Lobby, Login)
- **Cambio**: Eliminado todo rastro de `localStorage.setItem` y `localStorage.getItem`. Ahora el estado del usuario se obtiene del servidor vía `MasterService.getMe()`.
- **Archivos**: `lobby.ts`, `header.ts`, `login.ts`, `user-dashboard.ts`, `user-peticio.ts`.
