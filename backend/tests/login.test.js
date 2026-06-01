import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import adminRoutes from '../routes/admin.js';
import usersModel from '../models/users.js';
import bcrypt from 'bcryptjs';
import * as auth from '../helpers/autentication.js';

// Mockeamos el modelo de usuarios, bcrypt y la autenticación
vi.mock('../models/users.js', () => ({
    default: {
        login: vi.fn(),
        update: vi.fn(),
        getOne: vi.fn()
    }
}));

vi.mock('bcryptjs', () => ({
    default: {
        compare: vi.fn()
    }
}));

vi.mock('../helpers/autentication.js', () => ({
    generarToken: vi.fn(),
    generarRefreshToken: vi.fn(),
    verificarToken: vi.fn((req, res, next) => next())
}));

// Creamos una app de express para usar con supertest
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', adminRoutes);

describe('POST /api/login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería hacer login exitosamente con credenciales correctas', async () => {
        // Datos simulados
        const mockUser = {
            id: '12345',
            username: 'testuser',
            password: 'hashedpassword',
            rol: 'admin',
            mustChangePassword: false
        };

        // Configuramos los mocks
        usersModel.login.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        auth.generarToken.mockReturnValue('mock-token');
        auth.generarRefreshToken.mockReturnValue('mock-refresh-token');
        usersModel.update.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });

        // Verificaciones
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ username: 'testuser', rol: 'admin', id: '12345' });
        expect(usersModel.login).toHaveBeenCalledWith('testuser');
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(auth.generarToken).toHaveBeenCalledWith('12345', 'admin');
        
        // Verificar las cookies establecidas
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies.some(cookie => cookie.startsWith('token=mock-token'))).toBe(true);
        expect(cookies.some(cookie => cookie.startsWith('refreshToken=mock-refresh-token'))).toBe(true);
    });

    it('debería fallar el login si el usuario no existe', async () => {
        // Configuramos el mock para que devuelva nulo (usuario no encontrado)
        usersModel.login.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'nonexistent',
                password: 'password123'
            });

        expect(response.status).toBe(401);
        expect(response.body.ok).toBe(false);
        expect(response.body.msg).toBe('Usuari o contrasenya incorrectes');
        expect(usersModel.login).toHaveBeenCalledWith('nonexistent');
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('debería fallar el login si la contraseña es incorrecta', async () => {
        const mockUser = {
            id: '12345',
            username: 'testuser',
            password: 'hashedpassword',
            rol: 'admin',
            intentos_fallidos: 0,
            bloqueado_hasta: null
        };

        const mockUserWithAttempts = {
            id: '12345',
            username: 'testuser',
            password: 'hashedpassword',
            rol: 'admin',
            intentos_fallidos: 0
        };

        // Configuramos los mocks (usuario existe pero la contraseña no coincide)
        usersModel.login.mockResolvedValue(mockUser);
        usersModel.getOne.mockResolvedValue(mockUserWithAttempts);
        usersModel.update.mockResolvedValue(true);
        bcrypt.compare.mockResolvedValue(false);
        usersModel.getOne.mockResolvedValue(mockUser);
        usersModel.update.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body.ok).toBe(false);
        expect(response.body.msg).toBe('Usuari o contrasenya incorrectes, queden 2 intents');
        expect(response.body.intentosRestantes).toBe(2);
        expect(usersModel.login).toHaveBeenCalledWith('testuser');
        expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
        expect(usersModel.getOne).toHaveBeenCalledWith('12345');
        expect(usersModel.update).toHaveBeenCalledWith('12345', { intentos_fallidos: 1 });
        expect(auth.generarToken).not.toHaveBeenCalled();
    });
});
