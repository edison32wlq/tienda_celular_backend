import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { DetalleOrdenCompra } from './detalleOrdenCompra.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('DetalleOrdenCompraService', () => {
  let service: DetalleOrdenCompraService;
  let repo: jest.Mocked<Repository<DetalleOrdenCompra>>;

  let consoleErrorSpy: jest.SpyInstance;

  const repoMock: Partial<jest.Mocked<Repository<DetalleOrdenCompra>>> = {
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

  const mockDetalle = {
    id_detalle_oc: '1',
    id_orden_compra: '10',
    id_celular: '20',
    cantidad: 2,
    costo_unitario: 100,
    subtotal: 200,
  } as any;

  const mockPagination = { items: [mockDetalle], meta: { totalItems: 1 } } as any;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (repoMock.createQueryBuilder as jest.Mock).mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetalleOrdenCompraService,
        {
          provide: getRepositoryToken(DetalleOrdenCompra),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get(DetalleOrdenCompraService);
    repo = module.get(getRepositoryToken(DetalleOrdenCompra));
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar detalle', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockDetalle);
      (repo.save as jest.Mock).mockResolvedValue(mockDetalle);

      const res = await service.create({} as any);

      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.save).toHaveBeenCalledWith(mockDetalle);
      expect(res).toEqual(mockDetalle);
    });

    it('debería retornar null si falla', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockDetalle);
      (repo.save as jest.Mock).mockRejectedValue(new Error('boom'));

      const res = await service.create({} as any);

      expect(res).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería paginar sin filtros', async () => {
      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const res = await service.findAll({ page: 1, limit: 10 } as any);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('detalle');
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

      expect(qbMock.orderBy).toHaveBeenCalledWith('detalle.cantidad', 'DESC');
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
    it('debería buscar por id_detalle_oc', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockDetalle);

      const res = await service.findOne('1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id_detalle_oc: '1' } });
      expect(res).toEqual(mockDetalle);
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
      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockDetalle } as any);
      (repo.save as jest.Mock).mockResolvedValue(mockDetalle);

      const res = await service.update('1', { cantidad: 3 } as any);

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual(mockDetalle);
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
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDetalle);
      (repo.remove as jest.Mock).mockResolvedValue(mockDetalle);

      const res = await service.remove('1');

      expect(repo.remove).toHaveBeenCalledWith(mockDetalle);
      expect(res).toEqual(mockDetalle);
    });

    it('debería retornar null si falla', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('boom'));

      const res = await service.remove('1');

      expect(res).toBeNull();
    });
  });
});
