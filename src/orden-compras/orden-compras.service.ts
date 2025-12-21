import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { OrdenCompra } from './ordenCompra.entity';
import { CreateOrdenCompraDto } from './dto/create-ordenCompra.dto';
import { UpdateOrdenCompraDto } from './dto/update-ordenCompra.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class OrdenComprasService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly repo: Repository<OrdenCompra>,
  ) {}

  async create(dto: CreateOrdenCompraDto): Promise<OrdenCompra | null> {
    try {
      const detallesCalculados = (dto.detalles ?? []).map((d) => {
        const cantidad = Number(d.cantidad);
        const costoUnitario = Number(d.costo_unitario);
        const subtotal = Number((cantidad * costoUnitario).toFixed(2));

        return {
          ...d,
          cantidad,
          costo_unitario: costoUnitario,
          subtotal, 
        };
      });

      const total = Number(
        detallesCalculados.reduce((acc, d) => acc + Number(d.subtotal), 0).toFixed(2),
      );

      const orden = this.repo.create({
        id_proveedor: dto.id_proveedor,
        id_usuario: dto.id_usuario,
        fecha_emision: dto.fecha_emision,
        estado: dto.estado,
        total, 
        detalles: detallesCalculados as any, 
      });

      return await this.repo.save(orden);
    } catch (err) {
      console.error('Error creating ordenCompra:', err);
      return null;
    }
  }

  async findAll(
    queryDto: QueryDto,
    estado?: string,
  ): Promise<Pagination<OrdenCompra> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repo
        .createQueryBuilder('orden')
        .leftJoinAndSelect('orden.usuario', 'usuario')
        .leftJoinAndSelect('orden.detalles', 'detalles') 
        .leftJoinAndSelect('detalles.celular', 'celular'); 

      if (estado) {
        query.andWhere('orden.estado = :estado', { estado });
      }

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'estado':
              query.andWhere('orden.estado ILIKE :search', {
                search: `%${search}%`,
              });
              break;

            default:
              query.andWhere('(orden.estado ILIKE :search)', {
                search: `%${search}%`,
              });
          }
        } else {
          query.andWhere('orden.estado ILIKE :search', {
            search: `%${search}%`,
          });
        }
      }

      if (sort) {
        query.orderBy(`orden.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving ordenCompras:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<OrdenCompra | null> {
    try {
      return await this.repo.findOne({
        where: { id_orden_compra: id },
        relations: ['usuario', 'detalles', 'detalles.celular'],
      });
    } catch (err) {
      console.error('Error finding ordenCompra:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateOrdenCompraDto): Promise<OrdenCompra | null> {
    try {
      const orden = await this.repo.findOne({
        where: { id_orden_compra: id },
        relations: ['detalles'],
      });
      if (!orden) return null;

      if ((dto as any).detalles) {
        const detallesCalculados = ((dto as any).detalles ?? []).map((d: any) => {
          const cantidad = Number(d.cantidad);
          const costoUnitario = Number(d.costo_unitario);
          const subtotal = Number((cantidad * costoUnitario).toFixed(2));

          return { ...d, cantidad, costo_unitario: costoUnitario, subtotal };
        });

        (dto as any).total = Number(
          detallesCalculados.reduce((acc: number, d: any) => acc + Number(d.subtotal), 0).toFixed(2),
        );

        (dto as any).detalles = detallesCalculados;
      }

      Object.assign(orden, dto);
      return await this.repo.save(orden);
    } catch (err) {
      console.error('Error updating ordenCompra:', err);
      return null;
    }
  }

  async remove(id: string): Promise<OrdenCompra | null> {
    try {
      const orden = await this.findOne(id);
      if (!orden) return null;

      return await this.repo.remove(orden);
    } catch (err) {
      console.error('Error deleting ordenCompra:', err);
      return null;
    }
  }
}
