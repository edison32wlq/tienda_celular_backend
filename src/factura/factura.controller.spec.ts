import { Test, TestingModule } from '@nestjs/testing';
import { FacturaController } from './factura.controller';
import { FacturaService } from './factura.service';

describe('FacturaController', () => {
  let controller: FacturaController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturaController],
      providers: [{ provide: FacturaService, useValue: serviceMock }],
    }).compile();

    controller = module.get<FacturaController>(FacturaController);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create: deberia llamar al servicio y devolver el resultado', async () => {
    const factura = { id_factura: 'f-1' } as any;
    serviceMock.create.mockResolvedValueOnce(factura);

    const result = await controller.create({} as any);

    expect(serviceMock.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(factura);
  });

  it('findAll: deberia limitar el limite y llamar al servicio', async () => {
    const page = 1;
    const limit = 1000;
    const pagination = { items: [], meta: { totalItems: 0 } } as any;
    serviceMock.findAll.mockResolvedValueOnce(pagination);

    const result = await controller.findAll(page, limit);

    expect(serviceMock.findAll).toHaveBeenCalledWith({ page, limit: 100 });
    expect(result).toBe(pagination);
  });

  it('findOne: deberia llamar al servicio y devolver el resultado', async () => {
    const factura = { id_factura: 'f-1' } as any;
    serviceMock.findOne.mockResolvedValueOnce(factura);

    const result = await controller.findOne('f-1');

    expect(serviceMock.findOne).toHaveBeenCalledWith('f-1');
    expect(result).toBe(factura);
  });

  it('update: deberia llamar al servicio y devolver el resultado', async () => {
    const factura = { id_factura: 'f-1' } as any;
    serviceMock.update.mockResolvedValueOnce(factura);

    const result = await controller.update('f-1', { total: 10 } as any);

    expect(serviceMock.update).toHaveBeenCalledWith('f-1', { total: 10 });
    expect(result).toBe(factura);
  });

  it('remove: deberia llamar al servicio y devolver el resultado', async () => {
    const factura = { id_factura: 'f-1' } as any;
    serviceMock.remove.mockResolvedValueOnce(factura);

    const result = await controller.remove('f-1');

    expect(serviceMock.remove).toHaveBeenCalledWith('f-1');
    expect(result).toBe(factura);
  });
});
