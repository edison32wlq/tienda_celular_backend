import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proveedor } from './proveedor.schema';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectModel(Proveedor.name)
    private readonly proveedorModel: Model<Proveedor>,
  ) {}

  async create(dto: CreateProveedorDto): Promise<Proveedor | null> {
    try {
      const proveedor = new this.proveedorModel(dto);
      return await proveedor.save();
    } catch (err) {
      console.error('Error creando proveedor:', err);
      return null;
    }
  }

  async findAll(): Promise<Proveedor[] | null> {
    try {
      return await this.proveedorModel.find();
    } catch (err) {
      console.error('Error listando proveedores:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Proveedor | null> {
    try {
      return await this.proveedorModel.findById(id);
    } catch (err) {
      console.error('Error buscando proveedor:', err);
      return null;
    }
  }

  // ✅ CORREGIDO: no pisa campos requeridos con undefined
  async update(id: string, dto: UpdateProveedorDto): Promise<Proveedor | null> {
    try {
      const updated = await this.proveedorModel.findByIdAndUpdate(
        id,
        { $set: dto }, // solo actualiza lo que envías
        { new: true, runValidators: true }, // devuelve actualizado y valida
      );

      if (!updated) return null;
      return updated;
    } catch (err) {
      console.error('Error actualizando proveedor:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Proveedor | null> {
    try {
      const proveedor = await this.proveedorModel.findById(id);
      if (!proveedor) return null;

      await proveedor.deleteOne();
      return proveedor;
    } catch (err) {
      console.error('Error eliminando proveedor:', err);
      return null;
    }
  }
}
