import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit-log.schema';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
  ) {}

  async create(dto: CreateAuditLogDto): Promise<AuditLog | null> {
    try {
      const log = new this.auditLogModel(dto);
      return await log.save();
    } catch (err) {
      console.error('Error creando audit log:', err);
      return null;
    }
  }

  async findAll(): Promise<AuditLog[] | null> {
    try {
      return await this.auditLogModel.find();
    } catch (err) {
      console.error('Error listando audit logs:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<AuditLog | null> {
    try {
      return await this.auditLogModel.findById(id);
    } catch (err) {
      console.error('Error buscando audit log:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateAuditLogDto): Promise<AuditLog | null> {
    try {
      const log = await this.auditLogModel.findById(id);
      if (!log) return null;

      Object.assign(log, dto);
      return await log.save();
    } catch (err) {
      console.error('Error actualizando audit log:', err);
      return null;
    }
  }

  async remove(id: string): Promise<AuditLog | null> {
    try {
      const log = await this.auditLogModel.findById(id);
      if (!log) return null;

      await log.deleteOne();
      return log;
    } catch (err) {
      console.error('Error eliminando audit log:', err);
      return null;
    }
  }
}
