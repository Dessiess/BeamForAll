/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './reports/schema/report.entity';
import { ReportsModule } from './reports/reports.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'reports',
      useUnifiedTopology: true,
      entities: [Report],
    }),
    ReportsModule
  ],
})
export class AppModule {}
