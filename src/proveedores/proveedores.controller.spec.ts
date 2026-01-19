import { Test, TestingModule } from '@nestjs/testing';
import { ProveedoresController } from './proveedores.controller';
import { ProveedoresService } from './proveedores.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('ProveedoresController', () => {
  let controller: ProveedoresController;
  let service: jest.Mocked<ProveedoresService>;

  const mockProveedor = { _id: 'abc123', nombre: 'Proveedor 1' } as any;

  const proveedoresServiceMock: jest.Mocked<Partial<ProveedoresService>> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedoresController],
      providers: [
        {
          provide: ProveedoresService,
          useValue: proveedoresServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProveedoresController>(ProveedoresController);
    service = module.get(ProveedoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un proveedor', async () => {
      service.create.mockResolvedValue(mockProveedor);

      const res = await controller.create({} as any);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(res).toBe(mockProveedor);
    });

    it('debería lanzar InternalServerErrorException si create devuelve null', async () => {
      service.create.mockResolvedValue(null);

      await expect(controller.create({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar proveedores', async () => {
      service.findAll.mockResolvedValue([mockProveedor]);

      const res = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(res).toEqual([mockProveedor]);
    });

    it('debería lanzar InternalServerErrorException si findAll devuelve null', async () => {
      service.findAll.mockResolvedValue(null);

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('debería retornar un proveedor por id', async () => {
      service.findOne.mockResolvedValue(mockProveedor);

      const res = await controller.findOne('abc123');

      expect(service.findOne).toHaveBeenCalledWith('abc123');
      expect(res).toBe(mockProveedor);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un proveedor', async () => {
      service.update.mockResolvedValue(mockProveedor);

      const res = await controller.update('abc123', {} as any);

      expect(service.update).toHaveBeenCalledWith('abc123', expect.any(Object));
      expect(res).toBe(mockProveedor);
    });

    it('debería lanzar NotFoundException si update devuelve null', async () => {
      service.update.mockResolvedValue(null);

      await expect(controller.update('nope', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar un proveedor', async () => {
      service.remove.mockResolvedValue(mockProveedor);

      const res = await controller.remove('abc123');

      expect(service.remove).toHaveBeenCalledWith('abc123');
      expect(res).toBe(mockProveedor);
    });

    it('debería lanzar NotFoundException si remove devuelve null', async () => {
      service.remove.mockResolvedValue(null);

      await expect(controller.remove('nope')).rejects.toThrow(NotFoundException);
    });
  });
});
