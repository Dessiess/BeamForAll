/* eslint-disable prettier/prettier */
  /* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './login/register/auth.module';
import { ReportsModule } from './reports/reports.module';
  
  @Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'mongodb',
        url: 'mongodb://localhost:27017/reports',
        database: 'reports',
        useUnifiedTopology: true,
        synchronize: true, // Set to false in production
        autoLoadEntities: true,
      }),
      AuthModule,
      ReportsModule
    ],
  })

export class AppModule {}
  


