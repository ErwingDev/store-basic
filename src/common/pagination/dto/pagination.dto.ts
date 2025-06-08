import { IsOptional, IsNumber, Min, Max, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateQueryDto {

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @Type(() => String)
    search?: string;

    @IsOptional()
    @Type(() => String)
    // @IsArray()
    // @IsString({ each: true })
    @IsString()
    // equal?: string[];
    equal?: string;

    @IsOptional()
    @IsString()
    sortBy?: string;

}
