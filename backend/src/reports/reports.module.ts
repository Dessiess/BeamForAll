/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './schema/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report], 'reportsConnection')],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [TypeOrmModule],
})
export class ReportsModule {}
