import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator"
import { Message } from "../decorators/message.decorator";

export class CreateProductoDto {
    
    @IsInt({ message: Message.INT("$property") })
    idcategory: number;
    
    @IsString({ message: Message.STRING("$property") })
    @MaxLength(20, { message: Message.MAX_LENGTH("$property", 20) })
    name: string;
    
    @IsString({ message: Message.STRING("$property") })
    @IsOptional()
    description?: string;
    
    @IsNumber({}, { message: Message.NUMBER("$property") })
    price: number;
    
    @IsInt({ message: Message.INT("$property") })
    @Min(0, { message: Message.MIN("$property", 0) })
    stock: number;
    
    @IsOptional()
    @IsString({ message: Message.STRING("$property") })
    image?: any;
    
    @IsBoolean({ message: Message.BOOLEAN("$property") })
    status: boolean;
    
}

export class UpdateProductoDto {

    @IsInt({ message: Message.INT("$property") })
    @IsOptional()
    idcategory?: number;
    
    @IsString({ message: Message.STRING("$property") })
    @MaxLength(20, { message: Message.MAX_LENGTH("$property", 20) })
    @IsOptional()
    name?: string;
    
    @IsString({ message: Message.STRING("$property") })
    @IsOptional()
    description?: string;
    
    @IsNumber({}, { message: Message.NUMBER("$property") })
    @IsOptional()
    price?: number;
    
    @IsInt({ message: Message.INT("$property") })
    @Min(0, { message: Message.MIN("$property", 0) })
    @IsOptional()
    stock?: number;
    
    @IsOptional()
    @IsString({ message: Message.STRING("$property") })
    image?: any;
    
    @IsBoolean({ message: Message.BOOLEAN("$property") })
    @IsOptional()
    status?: boolean;
    
}

export class UpdateStockProductDto {

    @IsInt({ message: Message.INT("$property") })
    @Min(1, { message: Message.MIN("$property", 1) })
    stock: number;

}