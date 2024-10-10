/* eslint-disable prettier/prettier */
// src/reports/schema/create-report.dto.ts
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateReportDto {
    @IsString()
    @IsNotEmpty()
    company_name: string;

    @IsString()
    @IsNotEmpty()
    rn: string;

    @IsString()
    @IsNotEmpty()
    material_type: string;

    @IsString()
    @IsNotEmpty()
    package_number: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    start_time: string;

    @IsString()
    @IsNotEmpty()
    end_time: string;

    @IsString()
    @IsNotEmpty()
    option1time: string;

    @IsString()
    @IsNotEmpty()
    option2time: string;
}
