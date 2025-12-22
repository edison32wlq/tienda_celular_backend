import { Test, TestingModule } from '@nestjs/testing';
import { DetalleOrdenCompraController } from './detalle-orden-compra.controller';

describe('DetalleOrdenCompraController', () => {
  let controller: DetalleOrdenCompraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleOrdenCompraController],
    }).compile();

    controller = module.get<DetalleOrdenCompraController>(
      DetalleOrdenCompraController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
