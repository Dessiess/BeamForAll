/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './schema/report.schema';
import { CreateReportDto } from './schema/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    try {
      return await this.reportsService.createReport(createReportDto);
    } catch (error) {
      throw new HttpException("Failed to retrieve reports! " + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Report[]> {
    try {
      return await this.reportsService.getReports();
    } catch (error) {
      throw new HttpException('Failed to retrieve reports', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // kreirati novu rutu za UPDATE trenutno vec postojeceg report-a
}
