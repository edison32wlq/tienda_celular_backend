import { Test, TestingModule } from '@nestjs/testing';
import { PerfilClientesController } from './perfil-clientes.controller';

describe('PerfilClientesController', () => {
  let controller: PerfilClientesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilClientesController],
    }).compile();

    controller = module.get<PerfilClientesController>(PerfilClientesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
