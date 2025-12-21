import { Test, TestingModule } from '@nestjs/testing';
import { CelularesService } from './celulares.service';

describe('CelularesService', () => {
  let service: CelularesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CelularesService],
    }).compile();

    service = module.get<CelularesService>(CelularesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
