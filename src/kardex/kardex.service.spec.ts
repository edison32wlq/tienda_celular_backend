jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { KardexService } from './kardex.service';
import { Kardex } from './kardex.entity';

describe('KardexService', () => {
  let service: KardexService;

  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const qbMock = {
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    repoMock.createQueryBuilder.mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KardexService,
        { provide: getRepositoryToken(Kardex), useValue: repoMock },
      ],
    }).compile();

    service = module.get<KardexService>(KardexService);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create: deberia calcular stock para entrada', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);
    repoMock.create.mockImplementation((x: any) => x);
    repoMock.save.mockResolvedValueOnce({ id_kardex: 'k-1' });

    const dto: any = {
      id_celular: 'c-1',
      fecha_movimiento: '2026-01-18',
      tipo_movimiento: 'entrada',
      origen: 'COMPRA',
      id_documento: 'doc-1',
      cantidad: 5,
      costo_unitario: 10,
    };

    const result = await service.create(dto);

    const arg = repoMock.create.mock.calls[0][0];
    expect(arg.stock_anterior).toBe(0);
    expect(arg.stock_nuevo).toBe(5);
    expect(arg.fecha_movimiento).toBeInstanceOf(Date);
    expect(repoMock.save).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('create: deberia calcular stock para salida', async () => {
    repoMock.findOne.mockResolvedValueOnce({ stock_nuevo: 10 });
    repoMock.create.mockImplementation((x: any) => x);
    repoMock.save.mockResolvedValueOnce({ id_kardex: 'k-2' });

    const dto: any = {
      id_celular: 'c-1',
      fecha_movimiento: '2026-01-18',
      tipo_movimiento: 'salida',
      origen: 'VENTA',
      id_documento: 'doc-2',
      cantidad: 4,
      costo_unitario: 10,
    };

    await service.create(dto);

    const arg = repoMock.create.mock.calls[0][0];
    expect(arg.stock_anterior).toBe(10);
    expect(arg.stock_nuevo).toBe(6);
  });

  it('create: deberia lanzar si tipo_movimiento es invalido', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    const dto: any = {
      id_celular: 'c-1',
      fecha_movimiento: '2026-01-18',
      tipo_movimiento: 'otro',
      origen: 'X',
      id_documento: 'doc-3',
      cantidad: 1,
      costo_unitario: 1,
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('create: deberia lanzar si salida deja stock negativo', async () => {
    repoMock.findOne.mockResolvedValueOnce({ stock_nuevo: 2 });

    const dto: any = {
      id_celular: 'c-1',
      fecha_movimiento: '2026-01-18',
      tipo_movimiento: 'salida',
      origen: 'X',
      id_documento: 'doc-4',
      cantidad: 5,
      costo_unitario: 1,
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('findAll: deberia llamar paginate con el query builder', async () => {
    (paginate as any).mockResolvedValueOnce({ items: [] });

    const result = await service.findAll({ page: 1, limit: 10 } as any);

    expect(repoMock.createQueryBuilder).toHaveBeenCalledWith('kardex');
    expect(qbMock.orderBy).toHaveBeenCalledWith(
      'kardex.fecha_movimiento',
      'DESC',
    );
    expect(paginate).toHaveBeenCalledWith(qbMock, { page: 1, limit: 10 });
    expect(result).not.toBeNull();
  });

  it('findOne: deberia buscar por id_kardex', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_kardex: 'k-1' });

    const result = await service.findOne('k-1');

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id_kardex: 'k-1' } });
    expect(result).not.toBeNull();
  });

  it('update: deberia lanzar si no existe', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.update('k-1', { origen: 'X' } as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update: deberia guardar cambios si existe', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_kardex: 'k-1' });
    repoMock.save.mockResolvedValueOnce({ id_kardex: 'k-1' });

    const result = await service.update('k-1', { origen: 'X' } as any);

    expect(repoMock.save).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('remove: deberia lanzar si no existe', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.remove('k-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('remove: deberia eliminar si existe', async () => {
    const kardex = { id_kardex: 'k-1' };
    repoMock.findOne.mockResolvedValueOnce(kardex);
    repoMock.remove.mockResolvedValueOnce(kardex);

    const result = await service.remove('k-1');

    expect(repoMock.remove).toHaveBeenCalledWith(kardex);
    expect(result).toBe(kardex);
  });

  it('stockActual: deberia devolver cero si no hay registros', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    const result = await service.stockActual('c-1');

    expect(result).toEqual({ id_celular: 'c-1', stock_actual: 0 });
  });

  it('stockActual: deberia devolver ultimo stock si existe', async () => {
    repoMock.findOne.mockResolvedValueOnce({ stock_nuevo: 7 });

    const result = await service.stockActual('c-1');

    expect(result).toEqual({ id_celular: 'c-1', stock_actual: 7 });
  });
});
