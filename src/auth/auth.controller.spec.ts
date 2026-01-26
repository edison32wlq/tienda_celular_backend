import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const serviceMock = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deberia devolver token cuando las credenciales son validas', async () => {
      serviceMock.login.mockResolvedValueOnce('token-1');

      const result = await controller.login({} as any);

      expect(serviceMock.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        new SuccessResponseDto('Login successful', { access_token: 'token-1' }),
      );
    });

    it('deberia lanzar UnauthorizedException si no hay token', async () => {
      serviceMock.login.mockResolvedValueOnce(null);

      await expect(controller.login({} as any)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('deberia lanzar UnauthorizedException si el servicio falla', async () => {
      serviceMock.login.mockRejectedValueOnce(new Error('boom'));

      await expect(controller.login({} as any)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('deberia devolver token cuando el registro es exitoso', async () => {
      serviceMock.register.mockResolvedValueOnce('token-2');

      const result = await controller.register({} as any);

      expect(serviceMock.register).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        new SuccessResponseDto('Registration successful', {
          access_token: 'token-2',
        }),
      );
    });

    it('deberia lanzar BadRequestException si no hay token', async () => {
      serviceMock.register.mockResolvedValueOnce(null);

      await expect(controller.register({} as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('deberia lanzar BadRequestException si el servicio falla', async () => {
      serviceMock.register.mockRejectedValueOnce(new Error('boom'));

      await expect(controller.register({} as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
