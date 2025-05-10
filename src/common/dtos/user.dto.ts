import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { Role } from "../enums/role.enum";
import { Message } from "../decorators/message.decorator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateUserDto {

    @IsString({ message: Message.STRING("$property") })
    @MaxLength(15, { message: Message.MAX_LENGTH("$property", 15) })
    name: string;

    @IsString({ message: Message.STRING("$property") })
    @MaxLength(25, { message: Message.MAX_LENGTH("$property", 25) })
    surname: string;

    @IsEmail({}, { message: Message.EMAIL("$property") })
    @MaxLength(30, { message: Message.MAX_LENGTH("$property", 30) })
    email: string;

    @IsString({ message: Message.STRING("$property") })
    @MinLength(6)
    password: string;

    @IsString({ message: Message.STRING("$property") })
    @MaxLength(50, { message: Message.MAX_LENGTH("$property", 50) })
    @IsOptional()
    address?: string;

    @IsEnum(Role)
    @IsString({ message: Message.STRING("$property") })
    role: Role;
    
    @IsString({ message: Message.STRING("$property") })
    @MaxLength(10, { message: Message.MAX_LENGTH("$property", 10) })
    @IsOptional()
    phone?: string;
    
    // @ApiProperty({ type: 'string', format: 'binary' }) // Para Swagger
    @IsOptional()
    @IsString({ message: Message.STRING("$property") })
    image?: any;

    @IsOptional()
    @IsBoolean({ message: Message.BOOLEAN("$property") })
    status?: boolean;

}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
