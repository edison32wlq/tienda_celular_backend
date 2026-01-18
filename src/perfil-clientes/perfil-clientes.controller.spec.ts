import { Test, TestingModule } from '@nestjs/testing';
import { PerfilClientesController } from './perfil-clientes.controller';
import { PerfilClientesService } from './perfil-clientes.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('PerfilClientesController', () => {
  let controller: PerfilClientesController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilClientesController],
      providers: [{ provide: PerfilClientesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PerfilClientesController>(PerfilClientesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create: si service devuelve null -> error 500', async () => {
    serviceMock.create.mockResolvedValueOnce(null);

    await expect(controller.create({} as any)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('findAll: si service devuelve null -> error 500', async () => {
    serviceMock.findAll.mockResolvedValueOnce(null);

    await expect(
      controller.findAll({ page: 1, limit: 10 } as any),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('findOne: si no existe -> NotFound', async () => {
    serviceMock.findOne.mockResolvedValueOnce(null);

    await expect(controller.findOne('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update: si no existe -> NotFound', async () => {
    serviceMock.update.mockResolvedValueOnce(null);

    await expect(controller.update('1', {} as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove: si no existe -> NotFound', async () => {
    serviceMock.remove.mockResolvedValueOnce(null);

    await expect(controller.remove('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
