/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './schema/report.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report, 'reportsConnection')
    private _reportRepository: Repository<Report>,
  ) {}

  async create(reportData: CreateReportDto): Promise<Report> {
    const newReport = this._reportRepository.create(reportData as Partial<Report>);
    return await this._reportRepository.save(newReport);
  }

  async update(report: UpdateReportDto): Promise<UpdateResult> {
    return await this._reportRepository.update(report.id, report as unknown as Partial<Report>);
  }

  async getAll(): Promise<Report[]> {
    return await this._reportRepository.find();
  }

  async delete(reportId: string): Promise<DeleteResult> {
    return await this._reportRepository.delete(reportId);
  }
}
