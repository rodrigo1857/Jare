import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

@Module({})
export class PaginationDTO {

    @IsOptional()
    @IsPositive()
    @Type(() => Number) // enableImplicitConversion: true
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) // enableImplicitConversion: true
    offset?: number;


}
