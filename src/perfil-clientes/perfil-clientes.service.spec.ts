jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { PerfilClientesService } from './perfil-clientes.service';
import { PerfilCliente } from './perfilCliente.entity';

describe('PerfilClientesService', () => {
  let service: PerfilClientesService;

  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const qbMock = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    repoMock.createQueryBuilder.mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerfilClientesService,
        { provide: getRepositoryToken(PerfilCliente), useValue: repoMock },
      ],
    }).compile();

    service = module.get<PerfilClientesService>(PerfilClientesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create: si ya existe perfil para id_usuario debe retornar null', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_cliente: '1' }); // existe

    const dto = {
      id_usuario: 'user-1',
      cedula: '123',
      telefono: '099',
      direccion: 'Quito',
    };

    const result = await service.create(dto as any);

    expect(repoMock.findOne).toHaveBeenCalled();
    expect(result).toBeNull();
    expect(repoMock.save).not.toHaveBeenCalled();
  });

  it('create: si no existe, debe crear y guardar', async () => {
    repoMock.findOne.mockResolvedValueOnce(null); // no existe
    repoMock.create.mockReturnValue({ id_cliente: '1' });
    repoMock.save.mockResolvedValue({ id_cliente: '1' });

    const dto = {
      id_usuario: 'user-1',
      cedula: '123',
      telefono: '099',
      direccion: 'Quito',
    };

    const result = await service.create(dto as any);

    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  it('create: si revienta algo retorna null', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('boom'));
    const result = await service.create({} as any);
    expect(result).toBeNull();
  });

  it('findAll: debe llamar paginate', async () => {
    (paginate as any).mockResolvedValue({ items: [] });

    const result = await service.findAll({ page: 1, limit: 10 } as any);

    expect(repoMock.createQueryBuilder).toHaveBeenCalledWith('perfil');
    expect(qbMock.leftJoinAndSelect).toHaveBeenCalled();
    expect(paginate).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  it('findOne: debe buscar por id_cliente', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_cliente: '1' });

    const result = await service.findOne('1');

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id_cliente: '1' } });
    expect(result).not.toBeNull();
  });

  it('update: si no existe retorna null', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    const result = await service.update('1', { direccion: 'Nueva' } as any);

    expect(result).toBeNull();
  });

  it('remove: si no existe retorna null', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

    const result = await service.remove('1');

    expect(result).toBeNull();
  });
});
