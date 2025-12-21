import { Test, TestingModule } from '@nestjs/testing';
import { ProductosCarritoService } from './productos-carrito.service';

describe('ProductosCarritoService', () => {
  let service: ProductosCarritoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductosCarritoService],
    }).compile();

    service = module.get<ProductosCarritoService>(ProductosCarritoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
