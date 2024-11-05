/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, HttpException, HttpStatus, Put, Delete, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './schema/report.entity';
import { UpdateReportDto } from './dto/update-report.dto';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto): Promise<any> {
    try {
      return await this.reportsService.create(createReportDto);
    } catch (error) {
      throw new HttpException("Failed to create report! " + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async update(@Body() updateReportDto: UpdateReportDto): Promise<any> {
    try {
      return await this.reportsService.update(updateReportDto);
    } catch (error) {
      throw new HttpException("Failed to retrieve reports! " + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<any[]> {
    try {
      return await this.reportsService.getAll();
    } catch (error) {
      throw new HttpException('Failed to retrieve reports', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Delete(':id')
  async deleteReport(@Param('id') id: string): Promise<void> {
    await this.reportsService.delete(id);
  }
}
