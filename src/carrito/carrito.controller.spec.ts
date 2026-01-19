import { Test, TestingModule } from '@nestjs/testing';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('CarritoController', () => {
  let controller: CarritoController;
  let service: jest.Mocked<CarritoService>;

  const serviceMock: jest.Mocked<Partial<CarritoService>> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCarrito = { id_carrito: '1', id_cliente: '10', estado: 'ACTIVO' } as any;
  const mockPagination = { items: [mockCarrito], meta: { totalItems: 1 } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarritoController],
      providers: [
        { provide: CarritoService, useValue: serviceMock },
        // ✅ saltar AuthGuard(jwt)
        { provide: AuthGuard('jwt'), useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<CarritoController>(CarritoController);
    service = module.get(CarritoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y devolver SuccessResponseDto', async () => {
      service.create.mockResolvedValue(mockCarrito);

      const res = await controller.create({} as any);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(res).toEqual(new SuccessResponseDto('Carrito created successfully', mockCarrito));
    });

    it('debería lanzar InternalServerErrorException si create devuelve null', async () => {
      service.create.mockResolvedValue(null);

      await expect(controller.create({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('debería limitar query.limit a 100 si viene mayor', async () => {
      service.findAll.mockResolvedValue(mockPagination);

      const query: any = { page: 1, limit: 999 };

      const res = await controller.findAll(query);

      expect(query.limit).toBe(100);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(res).toEqual(new SuccessResponseDto('Carrito retrieved successfully', mockPagination));
    });

    it('debería devolver SuccessResponseDto con paginación', async () => {
      service.findAll.mockResolvedValue(mockPagination);

      const res = await controller.findAll({ page: 1, limit: 10 } as any);

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(res).toEqual(new SuccessResponseDto('Carrito retrieved successfully', mockPagination));
    });

    it('debería lanzar InternalServerErrorException si findAll devuelve null', async () => {
      service.findAll.mockResolvedValue(null);

      await expect(controller.findAll({ page: 1, limit: 10 } as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('debería devolver SuccessResponseDto', async () => {
      service.findOne.mockResolvedValue(mockCarrito);

      const res = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(res).toEqual(new SuccessResponseDto('Carrito retrieved successfully', mockCarrito));
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar y devolver SuccessResponseDto', async () => {
      service.update.mockResolvedValue(mockCarrito);

      const res = await controller.update('1', {} as any);

      expect(service.update).toHaveBeenCalledWith('1', expect.any(Object));
      expect(res).toEqual(new SuccessResponseDto('Carrito updated successfully', mockCarrito));
    });

    it('debería lanzar NotFoundException si update devuelve null', async () => {
      service.update.mockResolvedValue(null);

      await expect(controller.update('nope', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar y devolver SuccessResponseDto', async () => {
      service.remove.mockResolvedValue(mockCarrito);

      const res = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(res).toEqual(new SuccessResponseDto('Carrito deleted successfully', mockCarrito));
    });

    it('debería lanzar NotFoundException si remove devuelve null', async () => {
      service.remove.mockResolvedValue(null);

      await expect(controller.remove('nope')).rejects.toThrow(NotFoundException);
    });
  });
});
