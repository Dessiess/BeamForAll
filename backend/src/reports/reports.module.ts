import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report, ReportSchema } from './schema/report.schema'; // Import Report and ReportSchema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]), // Register ReportModel
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
