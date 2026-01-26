import { Test, TestingModule } from '@nestjs/testing';
import { KardexController } from './kardex.controller';
import { KardexService } from './kardex.service';

describe('KardexController', () => {
  let controller: KardexController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    stockActual: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KardexController],
      providers: [{ provide: KardexService, useValue: serviceMock }],
    }).compile();

    controller = module.get<KardexController>(KardexController);
    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create: deberia llamar al servicio y devolver el resultado', async () => {
    const kardex = { id_kardex: 'k-1' } as any;
    serviceMock.create.mockResolvedValueOnce(kardex);

    const result = await controller.create({} as any);

    expect(serviceMock.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(kardex);
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
    const kardex = { id_kardex: 'k-1' } as any;
    serviceMock.findOne.mockResolvedValueOnce(kardex);

    const result = await controller.findOne('k-1');

    expect(serviceMock.findOne).toHaveBeenCalledWith('k-1');
    expect(result).toBe(kardex);
  });

  it('update: deberia llamar al servicio y devolver el resultado', async () => {
    const kardex = { id_kardex: 'k-1' } as any;
    serviceMock.update.mockResolvedValueOnce(kardex);

    const result = await controller.update('k-1', { origen: 'X' } as any);

    expect(serviceMock.update).toHaveBeenCalledWith('k-1', { origen: 'X' });
    expect(result).toBe(kardex);
  });

  it('remove: deberia llamar al servicio y devolver el resultado', async () => {
    const kardex = { id_kardex: 'k-1' } as any;
    serviceMock.remove.mockResolvedValueOnce(kardex);

    const result = await controller.remove('k-1');

    expect(serviceMock.remove).toHaveBeenCalledWith('k-1');
    expect(result).toBe(kardex);
  });

  it('stockActual: deberia llamar al servicio y devolver el resultado', async () => {
    const stock = { id_celular: 'c-1', stock_actual: 10 };
    serviceMock.stockActual.mockResolvedValueOnce(stock);

    const result = await controller.stockActual('c-1');

    expect(serviceMock.stockActual).toHaveBeenCalledWith('c-1');
    expect(result).toBe(stock);
  });
});
