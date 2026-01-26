import { Test, TestingModule } from '@nestjs/testing';
import { DetalleFacturaController } from './detalle_factura.controller';
import { DetalleFacturaService } from './detalle_factura.service';

describe('DetalleFacturaController', () => {
  let controller: DetalleFacturaController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleFacturaController],
      providers: [{ provide: DetalleFacturaService, useValue: serviceMock }],
    }).compile();

    controller = module.get<DetalleFacturaController>(DetalleFacturaController);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create: deberia llamar al servicio y devolver el resultado', async () => {
    const detalle = { id_detalle_factura: 'df-1' } as any;
    serviceMock.create.mockResolvedValueOnce(detalle);

    const result = await controller.create({} as any);

    expect(serviceMock.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(detalle);
  });

  it('findAll: deberia limitar el limite y llamar al servicio', async () => {
    const page = 1;
    const limit = 999;
    const pagination = { items: [], meta: { totalItems: 0 } } as any;
    serviceMock.findAll.mockResolvedValueOnce(pagination);

    const result = await controller.findAll(page, limit);

    expect(serviceMock.findAll).toHaveBeenCalledWith({ page, limit: 100 });
    expect(result).toBe(pagination);
  });

  it('findOne: deberia llamar al servicio y devolver el resultado', async () => {
    const detalle = { id_detalle_factura: 'df-1' } as any;
    serviceMock.findOne.mockResolvedValueOnce(detalle);

    const result = await controller.findOne('df-1');

    expect(serviceMock.findOne).toHaveBeenCalledWith('df-1');
    expect(result).toBe(detalle);
  });

  it('update: deberia llamar al servicio y devolver el resultado', async () => {
    const detalle = { id_detalle_factura: 'df-1' } as any;
    serviceMock.update.mockResolvedValueOnce(detalle);

    const result = await controller.update('df-1', { subtotal: 10 } as any);

    expect(serviceMock.update).toHaveBeenCalledWith('df-1', { subtotal: 10 });
    expect(result).toBe(detalle);
  });

  it('remove: deberia llamar al servicio y devolver el resultado', async () => {
    const detalle = { id_detalle_factura: 'df-1' } as any;
    serviceMock.remove.mockResolvedValueOnce(detalle);

    const result = await controller.remove('df-1');

    expect(serviceMock.remove).toHaveBeenCalledWith('df-1');
    expect(result).toBe(detalle);
  });
});
