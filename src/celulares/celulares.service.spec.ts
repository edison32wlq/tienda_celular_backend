import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CelularesService } from './celulares.service';
import { Celular } from './celular.entity';
import { paginate } from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('CelularesService', () => {
  let service: CelularesService;
  let repo: jest.Mocked<Repository<Celular>>;

  // ✅ silenciar console.error en tests de error
  let consoleErrorSpy: jest.SpyInstance;

  const repoMock: Partial<jest.Mocked<Repository<Celular>>> = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  // mock básico de QueryBuilder
  const qbMock: any = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockCelular = { id_celular: '1', marca: 'Samsung', modelo: 'S24' } as any;
  const mockPagination = { items: [mockCelular], meta: { totalItems: 1 } } as any;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (repoMock.createQueryBuilder as jest.Mock).mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CelularesService,
        {
          provide: getRepositoryToken(Celular),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<CelularesService>(CelularesService);
    repo = module.get(getRepositoryToken(Celular));
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar celular', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockCelular);
      (repo.save as jest.Mock).mockResolvedValue(mockCelular);

      const res = await service.create({} as any);

      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.save).toHaveBeenCalledWith(mockCelular);
      expect(res).toEqual(mockCelular);
    });

    it('debería retornar null si falla', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockCelular);
      (repo.save as jest.Mock).mockRejectedValue(new Error('boom'));

      const res = await service.create({} as any);

      expect(res).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería paginar sin filtros', async () => {
      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const res = await service.findAll({ page: 1, limit: 10 } as any);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('celular');
      expect(paginate).toHaveBeenCalledWith(qbMock, { page: 1, limit: 10 });
      expect(res).toEqual(mockPagination);
    });

    it('debería aplicar orderBy si sort viene', async () => {
      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const res = await service.findAll({
        page: 1,
        limit: 10,
        sort: 'marca',
        order: 'DESC',
      } as any);

      expect(qbMock.orderBy).toHaveBeenCalledWith('celular.marca', 'DESC');
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
    it('debería buscar por id_celular', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockCelular);

      const res = await service.findOne('1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id_celular: '1' } });
      expect(res).toEqual(mockCelular);
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
      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockCelular } as any);
      (repo.save as jest.Mock).mockResolvedValue(mockCelular);

      const res = await service.update('1', { modelo: 'S25' } as any);

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual(mockCelular);
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
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCelular);
      (repo.remove as jest.Mock).mockResolvedValue(mockCelular);

      const res = await service.remove('1');

      expect(repo.remove).toHaveBeenCalledWith(mockCelular);
      expect(res).toEqual(mockCelular);
    });

    it('debería retornar null si falla', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('boom'));

      const res = await service.remove('1');

      expect(res).toBeNull();
    });
  });
});
