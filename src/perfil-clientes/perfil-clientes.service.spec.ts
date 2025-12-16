import { Test, TestingModule } from '@nestjs/testing';
import { PerfilClientesService } from './perfil-clientes.service';

describe('PerfilClientesService', () => {
  let service: PerfilClientesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfilClientesService],
    }).compile();

    service = module.get<PerfilClientesService>(PerfilClientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
