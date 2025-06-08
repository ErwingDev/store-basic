import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator"
import { Message } from "../decorators/message.decorator";
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";

export class CreateProductDto {

    @IsInt({ message: Message.INT("$property") })
    @Transform(({ value }) => parseInt(value))
    idCategory: number; 
    
    @IsString({ message: Message.STRING("$property") })
    @MaxLength(20, { message: Message.MAX_LENGTH("$property", 20) })
    name: string;
    
    @IsString({ message: Message.STRING("$property") })
    @IsOptional()
    description?: string;
    
    @IsNumber({}, { message: Message.NUMBER("$property") })
    @Transform(({ value }) => parseFloat(value))
    price: number;
    
    @IsInt({ message: Message.INT("$property") })
    @Min(0, { message: Message.MIN("$property", 0) })
    @Transform(({ value }) => parseInt(value))
    stock: number;
    
    @IsOptional()
    // @IsString({ message: Message.STRING("$property") })
    image?: any;
    
    @IsBoolean({ message: Message.BOOLEAN("$property") })
    @IsOptional()
    status: boolean;
    
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateStockProductDto {

    @IsInt({ message: Message.INT("$property") })
    @Min(1, { message: Message.MIN("$property", 1) })
    stock: number;

}