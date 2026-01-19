jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usuariosService: jest.Mocked<UsuariosService>;
  let jwtService: jest.Mocked<JwtService>;

  const usuariosServiceMock = {
    findByCorreo: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuariosService, useValue: usuariosServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuariosService = module.get(UsuariosService);
    jwtService = module.get(JwtService);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('deberia devolver null si el usuario no existe', async () => {
      usuariosService.findByCorreo.mockResolvedValueOnce(null);

      const result = await service.login({ correo: 'a@a.com', contrasena: 'x' });

      expect(result).toBeNull();
    });

    it('deberia devolver null si la contrasena no coincide', async () => {
      usuariosService.findByCorreo.mockResolvedValueOnce({
        id_usuario: 'u-1',
        correo: 'a@a.com',
        contrasena: 'hash',
        rol: { nombre: 'ADMIN' },
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.login({ correo: 'a@a.com', contrasena: 'x' });

      expect(result).toBeNull();
    });

    it('deberia devolver token si las credenciales son validas', async () => {
      usuariosService.findByCorreo.mockResolvedValueOnce({
        id_usuario: 'u-1',
        correo: 'a@a.com',
        contrasena: 'hash',
        rol: { nombre: 'ADMIN' },
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      jwtService.sign.mockReturnValueOnce('token-1');

      const result = await service.login({ correo: 'a@a.com', contrasena: 'x' });

      expect(jwtService.sign).toHaveBeenCalledWith({
        id: 'u-1',
        correo: 'a@a.com',
        rol: 'ADMIN',
      });
      expect(result).toBe('token-1');
    });

    it('deberia devolver null si ocurre un error inesperado', async () => {
      usuariosService.findByCorreo.mockRejectedValueOnce(new Error('boom'));

      const result = await service.login({ correo: 'a@a.com', contrasena: 'x' });

      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('deberia devolver null si no se crea el usuario', async () => {
      usuariosService.create.mockResolvedValueOnce(null);

      const result = await service.register({} as any);

      expect(result).toBeNull();
    });

    it('deberia devolver token si el registro es exitoso', async () => {
      usuariosService.create.mockResolvedValueOnce({
        id_usuario: 'u-1',
        correo: 'a@a.com',
        rol: { nombre: 'ADMIN' },
      } as any);
      jwtService.sign.mockReturnValueOnce('token-2');

      const result = await service.register({} as any);

      expect(jwtService.sign).toHaveBeenCalledWith({
        id: 'u-1',
        correo: 'a@a.com',
        rol: 'ADMIN',
      });
      expect(result).toBe('token-2');
    });

    it('deberia devolver null si ocurre un error inesperado', async () => {
      usuariosService.create.mockRejectedValueOnce(new Error('boom'));

      const result = await service.register({} as any);

      expect(result).toBeNull();
    });
  });
});
