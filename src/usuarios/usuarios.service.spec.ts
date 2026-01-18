jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';
import { QueryDto } from 'src/common/dto/query.dto';

describe('UsuariosService', () => {
  let service: UsuariosService;

  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  let qb: {
    leftJoinAndSelect: jest.Mock;
    andWhere: jest.Mock;
    orderBy: jest.Mock;
  };

  const baseUsuario: Usuario = {
    id_usuario: 'uuid-1',
    id_rol: 'rol-1',
    usuario: 'eddy',
    contrasena: 'hashed',
    nombres: 'Edison',
    apellidos: 'Ludeña',
    correo: 'eddy@mail.com',
    estado: true,
    profile: null as any,
    rol: null as any,
    perfilCliente: null as any,
    ordenesCompra: [],
    facturas: [],
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: getRepositoryToken(Usuario), useValue: repo },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);

    jest.clearAllMocks();
    (paginate as jest.Mock).mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('debe hashear contrasena y guardar usuario', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-10');

      repo.create.mockReturnValue({ ...baseUsuario, contrasena: 'hashed-10' });
      repo.save.mockResolvedValue({ ...baseUsuario, contrasena: 'hashed-10' });

      const dto = {
        id_rol: 'rol-1',
        usuario: 'eddy',
        contrasena: '123456',
        nombres: 'Edison',
        apellidos: 'Ludeña',
        correo: 'eddy@mail.com',
        estado: true,
      };

      const result = await service.create(dto as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, contrasena: 'hashed-10' });
      expect(repo.save).toHaveBeenCalled();
      expect(result?.contrasena).toBe('hashed-10');
    });

    it('debe retornar null si falla', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('hash error'));
      const result = await service.create({ contrasena: '123456' } as any);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debe filtrar por estado, buscar por usuario y ordenar', async () => {
      const query: QueryDto = {
        page: 1,
        limit: 10,
        search: 'ed',
        searchField: 'usuario',
        sort: 'usuario',
        order: 'DESC',
      };

      const paginated: Pagination<Usuario> = {
        items: [baseUsuario],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        } as any,
        links: {} as any,
      };

      (paginate as jest.Mock).mockResolvedValue(paginated);

      const result = await service.findAll(query, true);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('usuario');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('usuario.rol', 'rol');
      expect(qb.andWhere).toHaveBeenCalledWith('usuario.estado = :estado', { estado: true });
      expect(qb.andWhere).toHaveBeenCalledWith('usuario.usuario ILIKE :search', { search: '%ed%' });
      expect(qb.orderBy).toHaveBeenCalledWith('usuario.usuario', 'DESC');
      expect(paginate).toHaveBeenCalledWith(qb as unknown as SelectQueryBuilder<Usuario>, { page: 1, limit: 10 });

      expect(result).toEqual(paginated);
    });

    it('debe retornar null si falla', async () => {
      repo.createQueryBuilder.mockImplementationOnce(() => {
        throw new Error('qb error');
      });

      const result = await service.findAll({ page: 1, limit: 10 } as any);
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('debe retornar usuario con rol', async () => {
      repo.findOne.mockResolvedValueOnce(baseUsuario);

      const result = await service.findOne('uuid-1');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id_usuario: 'uuid-1' },
        relations: ['rol'],
      });
      expect(result).toEqual(baseUsuario);
    });

    it('debe retornar null si falla', async () => {
      repo.findOne.mockRejectedValueOnce(new Error('db error'));
      const result = await service.findOne('uuid-1');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debe retornar null si no existe', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      const result = await service.update('no-id', { nombres: 'X' } as any);
      expect(result).toBeNull();
    });

    it('si viene contrasena debe hashearla y guardar', async () => {
      repo.findOne.mockResolvedValueOnce({ ...baseUsuario });
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-new');
      repo.save.mockResolvedValueOnce({ ...baseUsuario, contrasena: 'hashed-new' });

      const result = await service.update('uuid-1', { contrasena: 'nuevo123' } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('nuevo123', 10);
      expect(repo.save).toHaveBeenCalled();
      expect(result?.contrasena).toBe('hashed-new');
    });
  });

  describe('remove', () => {
    it('debe retornar null si no existe', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      const result = await service.remove('no-id');
      expect(result).toBeNull();
    });

    it('debe remover y retornar usuario', async () => {
      repo.findOne.mockResolvedValueOnce({ ...baseUsuario });
      repo.remove.mockResolvedValueOnce({ ...baseUsuario });

      const result = await service.remove('uuid-1');

      expect(repo.remove).toHaveBeenCalled();
      expect(result?.id_usuario).toBe('uuid-1');
    });
  });
});
