import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('RolesController', () => {
  let controller: RolesController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create: si service devuelve null debe lanzar error', async () => {
    serviceMock.create.mockResolvedValueOnce(null);

    await expect(controller.create({} as any)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('findAll: si service devuelve null debe lanzar error', async () => {
    serviceMock.findAll.mockResolvedValueOnce(null);

    await expect(
      controller.findAll({ page: 1, limit: 10 } as any),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('findOne: si no existe debe lanzar NotFound', async () => {
    serviceMock.findOne.mockResolvedValueOnce(null);

    await expect(controller.findOne('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update: si no existe debe lanzar NotFound', async () => {
    serviceMock.update.mockResolvedValueOnce(null);

    await expect(controller.update('1', {} as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove: si no existe debe lanzar NotFound', async () => {
    serviceMock.remove.mockResolvedValueOnce(null);

    await expect(controller.remove('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
