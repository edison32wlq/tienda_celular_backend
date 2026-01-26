jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { NotFoundException } from '@nestjs/common';

import { FacturaService } from './factura.service';
import { Factura } from './factura.entity';

describe('FacturaService', () => {
  let service: FacturaService;

  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const qbMock = {
    where: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    repoMock.createQueryBuilder.mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturaService,
        { provide: getRepositoryToken(Factura), useValue: repoMock },
      ],
    }).compile();

    service = module.get<FacturaService>(FacturaService);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create: deberia mapear el dto y guardar', async () => {
    const dto: any = {
      numero_factura: 'F-1',
      fecha_emision: '2026-01-18',
      id_cliente: 'c-1',
      id_usuario: 'u-1',
      metodo_pago: 'EFECTIVO',
      subtotal: 10,
      iva: 1.2,
      total: 11.2,
    };

    repoMock.create.mockImplementation((x: any) => x);
    repoMock.save.mockResolvedValueOnce({ id_factura: 'f-1' });

    const result = await service.create(dto);

    const arg = repoMock.create.mock.calls[0][0];
    expect(arg.fecha_emision).toBeInstanceOf(Date);
    expect(arg.numero_factura).toBe(dto.numero_factura);
    expect(repoMock.save).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('findAll: deberia llamar paginate con el query builder', async () => {
    (paginate as any).mockResolvedValueOnce({ items: [] });

    const result = await service.findAll({ page: 1, limit: 10 } as any);

    expect(repoMock.createQueryBuilder).toHaveBeenCalledWith('factura');
    expect(paginate).toHaveBeenCalledWith(qbMock, { page: 1, limit: 10 });
    expect(result).not.toBeNull();
  });

  it('findOne: deberia buscar por id_factura', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_factura: 'f-1' });

    const result = await service.findOne('f-1');

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id_factura: 'f-1' },
    });
    expect(result).not.toBeNull();
  });

  it('update: deberia lanzar si no existe', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.update('f-1', { total: 1 } as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update: deberia guardar cambios si existe', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_factura: 'f-1' });
    repoMock.save.mockResolvedValueOnce({ id_factura: 'f-1' });

    const result = await service.update('f-1', { total: 99 } as any);

    expect(repoMock.save).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('remove: deberia lanzar si no existe', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.remove('f-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('remove: deberia eliminar si existe', async () => {
    const factura = { id_factura: 'f-1' };
    repoMock.findOne.mockResolvedValueOnce(factura);
    repoMock.remove.mockResolvedValueOnce(factura);

    const result = await service.remove('f-1');

    expect(repoMock.remove).toHaveBeenCalledWith(factura);
    expect(result).toBe(factura);
  });
});
