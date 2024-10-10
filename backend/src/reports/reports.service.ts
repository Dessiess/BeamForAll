/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schema/report.schema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateReportDto } from './schema/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  async createReport(reportData: any): Promise<Report> {
    const newReport = new this.reportModel(reportData);
    return await newReport.save();
  }

  async getReports(): Promise<Report[]> {
    return await this.reportModel.find().exec();
  }
}
