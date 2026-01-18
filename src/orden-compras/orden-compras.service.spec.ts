jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { OrdenComprasService } from './orden-compras.service';
import { OrdenCompra } from './ordenCompra.entity';

describe('OrdenComprasService', () => {
  let service: OrdenComprasService;

  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const qbMock = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    repoMock.createQueryBuilder.mockReturnValue(qbMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdenComprasService,
        { provide: getRepositoryToken(OrdenCompra), useValue: repoMock },
      ],
    }).compile();

    service = module.get<OrdenComprasService>(OrdenComprasService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create: debe calcular subtotal y total y guardar', async () => {
    // dto con 2 detalles
    const dto: any = {
      id_proveedor: 'prov-1',
      id_usuario: 'user-1',
      fecha_emision: '2026-01-18',
      estado: 'PENDIENTE',
      detalles: [
        { cantidad: '2', costo_unitario: '10.5' }, // subtotal 21.00
        { cantidad: 1, costo_unitario: 3 },        // subtotal 3.00
      ],
    };

    // repo.create devuelve lo mismo que le pasen (simple)
    repoMock.create.mockImplementation((x: any) => x);
    repoMock.save.mockResolvedValue({ id_orden_compra: 'oc-1' });

    const result = await service.create(dto);

    expect(repoMock.create).toHaveBeenCalled();

    const arg = repoMock.create.mock.calls[0][0];

    // total esperado 24.00
    expect(arg.total).toBe(24);

    // subtotales
    expect(arg.detalles[0].subtotal).toBe(21);
    expect(arg.detalles[1].subtotal).toBe(3);

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

  it('findAll: debe llamar paginate con el querybuilder', async () => {
    (paginate as any).mockResolvedValue({ items: [] });

    const result = await service.findAll({ page: 1, limit: 10 } as any, 'PENDIENTE');

    expect(repoMock.createQueryBuilder).toHaveBeenCalledWith('orden');
    expect(qbMock.leftJoinAndSelect).toHaveBeenCalled();
    expect(qbMock.andWhere).toHaveBeenCalled(); // por estado
    expect(paginate).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  it('findOne: debe buscar por id_orden_compra con relations', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_orden_compra: 'oc-1' });

    const result = await service.findOne('oc-1');

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id_orden_compra: 'oc-1' },
      relations: ['usuario', 'detalles', 'detalles.celular'],
    });
    expect(result).not.toBeNull();
  });

  it('update: si no existe retorna null', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    const result = await service.update('oc-1', { estado: 'X' } as any);

    expect(result).toBeNull();
  });

  it('update: si vienen detalles debe recalcular total', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id_orden_compra: 'oc-1', detalles: [] });
    repoMock.save.mockResolvedValueOnce({ id_orden_compra: 'oc-1' });

    const dto: any = {
      detalles: [
        { cantidad: 2, costo_unitario: 5 }, // 10
        { cantidad: 1, costo_unitario: 1.25 }, // 1.25
      ],
    };

    const result = await service.update('oc-1', dto);

    // aquí el service modifica dto en runtime
    expect((dto as any).total).toBe(11.25);
    expect((dto as any).detalles[0].subtotal).toBe(10);

    expect(repoMock.save).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  it('remove: si no existe retorna null', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

    const result = await service.remove('oc-1');

    expect(result).toBeNull();
  });
});
