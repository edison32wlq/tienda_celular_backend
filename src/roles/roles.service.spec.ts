jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { RolesService } from './roles.service';
import { Rol } from './rol.entity';

describe('RolesService', () => {
  let service: RolesService;

  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const qbMock = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    repoMock.createQueryBuilder.mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Rol), useValue: repoMock },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create: debe guardar rol', async () => {
    repoMock.create.mockReturnValue({ id_rol: '1', nombre_rol: 'Admin' });
    repoMock.save.mockResolvedValue({ id_rol: '1', nombre_rol: 'Admin' });

    const dto = { nombre_rol: 'Admin', descripcion: 'Todo' };
    const result = await service.create(dto as any);

    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  it('create: si hay error debe retornar null', async () => {
    repoMock.create.mockImplementation(() => {
      throw new Error('boom');
    });

    const result = await service.create({} as any);
    expect(result).toBeNull();
  });

  it('findAll: debe llamar paginate', async () => {
    (paginate as any).mockResolvedValue({ items: [] });

    const result = await service.findAll({ page: 1, limit: 10 } as any);

    expect(repoMock.createQueryBuilder).toHaveBeenCalledWith('rol');
    expect(paginate).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  it('findOne: debe llamar findOne del repo', async () => {
    repoMock.findOne.mockResolvedValue({ id_rol: '1' });

    const result = await service.findOne('1');

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id_rol: '1' } });
    expect(result).not.toBeNull();
  });

  it('update: si no existe retorna null', async () => {
    repoMock.findOne.mockResolvedValue(null);

    const result = await service.update('1', { nombre_rol: 'Nuevo' } as any);

    expect(result).toBeNull();
  });

  it('remove: si no existe retorna null', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

    const result = await service.remove('1');

    expect(result).toBeNull();
  });
});
