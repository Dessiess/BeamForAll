/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './login/register/auth.module';
import { ReportsModule } from './reports/reports.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // Connection: `reports` database
    TypeOrmModule.forRootAsync({
      name: 'reportsConnection',
      useFactory: (): TypeOrmModuleOptions => ({
        type: 'mongodb',
        url: 'mongodb://localhost:27017/reports',
        database: 'reports',
        useUnifiedTopology: true,
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    // Connection: `auth` database
    TypeOrmModule.forRootAsync({
      name: 'authConnection',
      useFactory: (): TypeOrmModuleOptions => ({
        type: 'mongodb',
        url: 'mongodb://localhost:27017/auth',
        database: 'register',
        useUnifiedTopology: true,
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),

    // Feature modules
    AuthModule,
    ReportsModule,
  ],
})
export class AppModule {}