import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { ProductosCarritoService } from './productos-carrito.service';
import { ProductoCarrito } from './productoCarrito.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('ProductosCarritoService', () => {
  let service: ProductosCarritoService;
  let repo: jest.Mocked<Repository<ProductoCarrito>>;

  let consoleErrorSpy: jest.SpyInstance;

  const repoMock: Partial<jest.Mocked<Repository<ProductoCarrito>>> = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const qbMock: any = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockPc = {
    id_producto_carrito: '1',
    id_carrito: '10',
    id_celular: '20',
    cantidad: 2,
    precio_unitario: 100,
  } as any;

  const mockPagination = { items: [mockPc], meta: { totalItems: 1 } } as any;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (repoMock.createQueryBuilder as jest.Mock).mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosCarritoService,
        {
          provide: getRepositoryToken(ProductoCarrito),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<ProductosCarritoService>(ProductosCarritoService);
    repo = module.get(getRepositoryToken(ProductoCarrito));
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockPc);
      (repo.save as jest.Mock).mockResolvedValue(mockPc);

      const res = await service.create({} as any);

      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.save).toHaveBeenCalledWith(mockPc);
      expect(res).toEqual(mockPc);
    });

    it('debería retornar null si falla', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockPc);
      (repo.save as jest.Mock).mockRejectedValue(new Error('boom'));

      const res = await service.create({} as any);

      expect(res).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería paginar', async () => {
      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const res = await service.findAll({ page: 1, limit: 10 } as any);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('pc');
      expect(paginate).toHaveBeenCalledWith(qbMock, { page: 1, limit: 10 });
      expect(res).toEqual(mockPagination);
    });

    it('debería aplicar orderBy si sort viene', async () => {
      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const res = await service.findAll({
        page: 1,
        limit: 10,
        sort: 'cantidad',
        order: 'DESC',
      } as any);

      expect(qbMock.orderBy).toHaveBeenCalledWith('pc.cantidad', 'DESC');
      expect(res).toEqual(mockPagination);
    });

    it('debería retornar null si ocurre error', async () => {
      (repo.createQueryBuilder as jest.Mock).mockImplementation(() => {
        throw new Error('boom');
      });

      const res = await service.findAll({ page: 1, limit: 10 } as any);

      expect(res).toBeNull();
    });
  });

  describe('findOne', () => {
    it('debería buscar por id_producto_carrito', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockPc);

      const res = await service.findOne('1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id_producto_carrito: '1' } });
      expect(res).toEqual(mockPc);
    });

    it('debería retornar null si falla', async () => {
      (repo.findOne as jest.Mock).mockRejectedValue(new Error('boom'));

      const res = await service.findOne('1');

      expect(res).toBeNull();
    });
  });

  describe('update', () => {
    it('debería retornar null si no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const res = await service.update('nope', {} as any);

      expect(res).toBeNull();
    });

    it('debería actualizar y guardar', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockPc } as any);
      (repo.save as jest.Mock).mockResolvedValue(mockPc);

      const res = await service.update('1', { cantidad: 3 } as any);

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual(mockPc);
    });

    it('debería retornar null si falla', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('boom'));

      const res = await service.update('1', {} as any);

      expect(res).toBeNull();
    });
  });

  describe('remove', () => {
    it('debería retornar null si no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const res = await service.remove('nope');

      expect(res).toBeNull();
    });

    it('debería eliminar y devolver', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPc);
      (repo.remove as jest.Mock).mockResolvedValue(mockPc);

      const res = await service.remove('1');

      expect(repo.remove).toHaveBeenCalledWith(mockPc);
      expect(res).toEqual(mockPc);
    });

    it('debería retornar null si falla', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('boom'));

      const res = await service.remove('1');

      expect(res).toBeNull();
    });
  });
});
