import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProveedoresService } from './proveedores.service';
import { Proveedor } from './proveedor.schema';

describe('ProveedoresService', () => {
  let service: ProveedoresService;

  // Mock base del Model de Mongoose (funciona para "new Model(dto)")
  const proveedorModelMock: any = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProveedoresService,
        {
          provide: getModelToken(Proveedor.name),
          useValue: proveedorModelMock,
        },
      ],
    }).compile();

    service = module.get<ProveedoresService>(ProveedoresService);

    // Métodos estáticos del model
    proveedorModelMock.find = jest.fn();
    proveedorModelMock.findById = jest.fn();
    proveedorModelMock.findByIdAndUpdate = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar un proveedor', async () => {
      const saved = { _id: '1', nombre: 'Prov' } as any;

      // cuando se haga: new this.proveedorModel(dto)
      proveedorModelMock.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved),
      }));

      const res = await service.create({ nombre: 'Prov' } as any);

      expect(res).toEqual(saved);
      expect(proveedorModelMock).toHaveBeenCalledTimes(1);
    });

    it('debería retornar null si ocurre error', async () => {
      proveedorModelMock.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('boom')),
      }));

      const res = await service.create({} as any);

      expect(res).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería listar proveedores', async () => {
      const list = [{ _id: '1' }] as any;
      proveedorModelMock.find.mockResolvedValue(list);

      const res = await service.findAll();

      expect(proveedorModelMock.find).toHaveBeenCalledTimes(1);
      expect(res).toEqual(list);
    });

    it('debería retornar null si find falla', async () => {
      proveedorModelMock.find.mockRejectedValue(new Error('boom'));

      const res = await service.findAll();

      expect(res).toBeNull();
    });
  });

  describe('findOne', () => {
    it('debería buscar por id', async () => {
      const item = { _id: 'abc' } as any;
      proveedorModelMock.findById.mockResolvedValue(item);

      const res = await service.findOne('abc');

      expect(proveedorModelMock.findById).toHaveBeenCalledWith('abc');
      expect(res).toEqual(item);
    });

    it('debería retornar null si findById falla', async () => {
      proveedorModelMock.findById.mockRejectedValue(new Error('boom'));

      const res = await service.findOne('abc');

      expect(res).toBeNull();
    });
  });

  describe('update', () => {
    it('debería actualizar y devolver el actualizado', async () => {
      const updated = { _id: 'abc', nombre: 'Nuevo' } as any;
      proveedorModelMock.findByIdAndUpdate.mockResolvedValue(updated);

      const res = await service.update('abc', { nombre: 'Nuevo' } as any);

      expect(proveedorModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc',
        { $set: { nombre: 'Nuevo' } },
        { new: true, runValidators: true },
      );
      expect(res).toEqual(updated);
    });

    it('debería retornar null si no existe (findByIdAndUpdate devuelve null)', async () => {
      proveedorModelMock.findByIdAndUpdate.mockResolvedValue(null);

      const res = await service.update('nope', {} as any);

      expect(res).toBeNull();
    });

    it('debería retornar null si ocurre error', async () => {
      proveedorModelMock.findByIdAndUpdate.mockRejectedValue(new Error('boom'));

      const res = await service.update('abc', {} as any);

      expect(res).toBeNull();
    });
  });

  describe('remove', () => {
    it('debería eliminar un proveedor y devolverlo', async () => {
      const doc = {
        _id: 'abc',
        deleteOne: jest.fn().mockResolvedValue(true),
      } as any;

      proveedorModelMock.findById.mockResolvedValue(doc);

      const res = await service.remove('abc');

      expect(proveedorModelMock.findById).toHaveBeenCalledWith('abc');
      expect(doc.deleteOne).toHaveBeenCalledTimes(1);
      expect(res).toBe(doc);
    });

    it('debería retornar null si no existe', async () => {
      proveedorModelMock.findById.mockResolvedValue(null);

      const res = await service.remove('nope');

      expect(res).toBeNull();
    });

    it('debería retornar null si ocurre error', async () => {
      proveedorModelMock.findById.mockRejectedValue(new Error('boom'));

      const res = await service.remove('abc');

      expect(res).toBeNull();
    });
  });
});
