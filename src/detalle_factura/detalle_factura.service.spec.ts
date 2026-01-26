jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { NotFoundException } from '@nestjs/common';

import { DetalleFacturaService } from './detalle_factura.service';
import { DetalleFactura } from './detalle_factura.entity';

describe('DetalleFacturaService', () => {
  let service: DetalleFacturaService;

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
        DetalleFacturaService,
        { provide: getRepositoryToken(DetalleFactura), useValue: repoMock },
      ],
    }).compile();

    service = module.get<DetalleFacturaService>(DetalleFacturaService);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create: deberia mapear el dto y guardar', async () => {
    const dto: any = {
      id_factura: 'f-1',
      id_celular: 'c-1',
      cantidad: 2,
      precio_unitario: 10,
      subtotal: 20,
    };

    repoMock.create.mockImplementation((x: any) => x);
    repoMock.save.mockResolvedValueOnce({ id_detalle_factura: 'df-1' });

    const result = await service.create(dto);

    const arg = repoMock.create.mock.calls[0][0];
    expect(arg.id_factura).toBe(dto.id_factura);
    expect(arg.subtotal).toBe(dto.subtotal);
    expect(repoMock.save).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('findAll: deberia llamar paginate con el query builder', async () => {
    (paginate as any).mockResolvedValueOnce({ items: [] });

    const result = await service.findAll({ page: 1, limit: 10 } as any);

    expect(repoMock.createQueryBuilder).toHaveBeenCalledWith('detalle_factura');
    expect(paginate).toHaveBeenCalledWith(qbMock, { page: 1, limit: 10 });
    expect(result).not.toBeNull();
  });

  it('findOne: deberia buscar por id_detalle_factura', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_detalle_factura: 'df-1' });

    const result = await service.findOne('df-1');

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id_detalle_factura: 'df-1' },
    });
    expect(result).not.toBeNull();
  });

  it('update: deberia lanzar si no existe', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await expect(
      service.update('df-1', { subtotal: 1 } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update: deberia guardar cambios si existe', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_detalle_factura: 'df-1' });
    repoMock.save.mockResolvedValueOnce({ id_detalle_factura: 'df-1' });

    const result = await service.update('df-1', { subtotal: 99 } as any);

    expect(repoMock.save).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('remove: deberia lanzar si no existe', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.remove('df-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('remove: deberia eliminar si existe', async () => {
    const detalle = { id_detalle_factura: 'df-1' };
    repoMock.findOne.mockResolvedValueOnce(detalle);
    repoMock.remove.mockResolvedValueOnce(detalle);

    const result = await service.remove('df-1');

    expect(repoMock.remove).toHaveBeenCalledWith(detalle);
    expect(result).toBe(detalle);
  });
});
