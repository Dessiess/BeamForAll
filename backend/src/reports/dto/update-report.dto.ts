/* eslint-disable prettier/prettier */
import { IsString, IsDateString } from 'class-validator';

export class UpdateReportDto {
    @IsString()
    id: string;

    @IsString()
    company_name?: string;

    @IsString()
    rn?: string;

    @IsString()
    material_type?: string;

    @IsString()
    package_number?: string;

    @IsString()
    comment?: string;

    @IsDateString()
    date?: string;

    @IsString()
    start_time?: string;

    @IsString()
    end_time?: string;

    @IsString()
    ready_time?: string;

    @IsString()
    departure_time?: string;
}
