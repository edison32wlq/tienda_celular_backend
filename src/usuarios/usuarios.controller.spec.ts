import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryDto } from 'src/common/dto/query.dto';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: jest.Mocked<UsuariosService>;

  const usuario = {
    id_usuario: 'uuid-1',
    id_rol: 'rol-1',
    usuario: 'eddy',
    contrasena: 'hashed',
    nombres: 'Edison',
    apellidos: 'Ludeña',
    correo: 'eddy@mail.com',
    estado: true,
    profile: null,
    rol: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: {
            create: jest.fn().mockResolvedValue(usuario),
            findAll: jest.fn().mockResolvedValue({
              items: [usuario],
              meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
            }),
            findOne: jest.fn().mockResolvedValue(usuario),
            update: jest.fn().mockResolvedValue(usuario),
            remove: jest.fn().mockResolvedValue(usuario),
          },
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get(UsuariosService);
    jest.clearAllMocks();
  });

  it('create debe retornar SuccessResponseDto', async () => {
    const response = await controller.create({ usuario: 'eddy' } as any);
    expect(response?.success).toBe(true);
    expect(response?.data?.usuario).toBe('eddy');
  });

  it('create debe lanzar InternalServerErrorException si falla', async () => {
    service.create.mockResolvedValueOnce(null as any);
    await expect(controller.create({ usuario: 'x' } as any)).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  describe('findAll', () => {
    it('debe retornar lista paginada', async () => {
      const query: QueryDto = { page: 1, limit: 10 } as any;
      const response = await controller.findAll(query, 'true');
      expect(response?.success).toBe(true);
      expect(service.findAll).toHaveBeenCalledWith(query, true);
    });

    it('si limit > 100 lo baja a 100', async () => {
      const query: QueryDto = { page: 1, limit: 1000 } as any;
      await controller.findAll(query, 'true');
      expect(service.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }), true);
    });

    it('debe lanzar BadRequestException si estado es inválido', async () => {
      const query: QueryDto = { page: 1, limit: 10 } as any;
      await expect(controller.findAll(query, 'yes')).rejects.toBeInstanceOf(BadRequestException);
      expect(service.findAll).not.toHaveBeenCalled();
    });

    it('debe lanzar InternalServerErrorException si service retorna null', async () => {
      service.findAll.mockResolvedValueOnce(null as any);
      const query: QueryDto = { page: 1, limit: 10 } as any;
      await expect(controller.findAll(query, 'true')).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  it('findOne debe lanzar NotFoundException si no existe', async () => {
    service.findOne.mockResolvedValueOnce(null as any);
    await expect(controller.findOne('no-id')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update debe lanzar NotFoundException si no existe', async () => {
    service.update.mockResolvedValueOnce(null as any);
    await expect(controller.update('no-id', { nombres: 'x' } as any)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('remove debe lanzar NotFoundException si no existe', async () => {
    service.remove.mockResolvedValueOnce(null as any);
    await expect(controller.remove('no-id')).rejects.toBeInstanceOf(NotFoundException);
  });
});
