import {
  Controller, Get, Post, Put, Delete, Param, Body,
  NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  async create(@Body() dto: CreateAuditLogDto) {
    const log = await this.auditLogsService.create(dto);
    if (!log) throw new InternalServerErrorException('Failed to create audit log');
    return log;
  }

  @Get()
  async findAll() {
    const logs = await this.auditLogsService.findAll();
    if (!logs) throw new InternalServerErrorException('Could not retrieve audit logs');
    return logs;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const log = await this.auditLogsService.findOne(id);
    if (!log) throw new NotFoundException('Audit log not found');
    return log;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAuditLogDto) {
    const log = await this.auditLogsService.update(id, dto);
    if (!log) throw new NotFoundException('Audit log not found');
    return log;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const log = await this.auditLogsService.remove(id);
    if (!log) throw new NotFoundException('Audit log not found');
    return log;
  }
}
