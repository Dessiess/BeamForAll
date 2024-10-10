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
    comment: string;

    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    start_time: string;

    @IsString()
    @IsNotEmpty()
    end_time: string;
}
