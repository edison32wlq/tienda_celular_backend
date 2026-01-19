import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { CarritoService } from './carrito.service';
import { Carrito } from './carrito.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('CarritoService', () => {
  let service: CarritoService;
  let repo: jest.Mocked<Repository<Carrito>>;

  let consoleErrorSpy: jest.SpyInstance;

  const repoMock: Partial<jest.Mocked<Repository<Carrito>>> = {
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

  const mockCarrito = { id_carrito: '1', id_cliente: '10', estado: 'ACTIVO' } as any;
  const mockPagination = { items: [mockCarrito], meta: { totalItems: 1 } } as any;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (repoMock.createQueryBuilder as jest.Mock).mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarritoService,
        {
          provide: getRepositoryToken(Carrito),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<CarritoService>(CarritoService);
    repo = module.get(getRepositoryToken(Carrito));
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar carrito (mapeo dto a entity)', async () => {
      const dto: any = { id_cliente: '10', estado: 'ACTIVO' };

      (repo.create as jest.Mock).mockReturnValue(mockCarrito);
      (repo.save as jest.Mock).mockResolvedValue(mockCarrito);

      const res = await service.create(dto);

      // ✅ aquí verificamos que respeta tu lógica: create({id_cliente, estado})
      expect(repo.create).toHaveBeenCalledWith({ id_cliente: dto.id_cliente, estado: dto.estado });
      expect(repo.save).toHaveBeenCalledWith(mockCarrito);
      expect(res).toEqual(mockCarrito);
    });

    it('debería retornar null si falla', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockCarrito);
      (repo.save as jest.Mock).mockRejectedValue(new Error('boom'));

      const res = await service.create({ id_cliente: '10', estado: 'ACTIVO' } as any);

      expect(res).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería paginar sin filtros', async () => {
      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const res = await service.findAll({ page: 1, limit: 10 } as any);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('carrito');
      expect(paginate).toHaveBeenCalledWith(qbMock, { page: 1, limit: 10 });
      expect(res).toEqual(mockPagination);
    });

    it('debería aplicar orderBy si sort viene', async () => {
      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const res = await service.findAll({
        page: 1,
        limit: 10,
        sort: 'estado',
        order: 'DESC',
      } as any);

      expect(qbMock.orderBy).toHaveBeenCalledWith('carrito.estado', 'DESC');
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
    it('debería buscar por id_carrito', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockCarrito);

      const res = await service.findOne('1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id_carrito: '1' } });
      expect(res).toEqual(mockCarrito);
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
      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockCarrito } as any);
      (repo.save as jest.Mock).mockResolvedValue(mockCarrito);

      const res = await service.update('1', { estado: 'INACTIVO' } as any);

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual(mockCarrito);
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
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCarrito);
      (repo.remove as jest.Mock).mockResolvedValue(mockCarrito);

      const res = await service.remove('1');

      expect(repo.remove).toHaveBeenCalledWith(mockCarrito);
      expect(res).toEqual(mockCarrito);
    });

    it('debería retornar null si falla', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('boom'));

      const res = await service.remove('1');

      expect(res).toBeNull();
    });
  });
});
