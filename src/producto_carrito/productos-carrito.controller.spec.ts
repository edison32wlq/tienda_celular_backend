import { Test, TestingModule } from '@nestjs/testing';
import { ProductosCarritoController } from './productos-carrito.controller';

describe('ProductosCarritoController', () => {
  let controller: ProductosCarritoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosCarritoController],
    }).compile();

    controller = module.get<ProductosCarritoController>(ProductosCarritoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
