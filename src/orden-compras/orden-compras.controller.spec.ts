import { Test, TestingModule } from '@nestjs/testing';
import { OrdenComprasController } from './orden-compras.controller';

describe('OrdenComprasController', () => {
  let controller: OrdenComprasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenComprasController],
    }).compile();

    controller = module.get<OrdenComprasController>(OrdenComprasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
