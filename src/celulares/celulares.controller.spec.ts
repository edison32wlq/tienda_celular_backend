import { Test, TestingModule } from '@nestjs/testing';
import { CelularesController } from './celulares.controller';

describe('CelularesController', () => {
  let controller: CelularesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CelularesController],
    }).compile();

    controller = module.get<CelularesController>(CelularesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
