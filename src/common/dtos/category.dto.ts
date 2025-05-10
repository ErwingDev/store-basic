import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";
import { Message } from "../decorators/message.decorator";
import { PartialType } from '@nestjs/mapped-types';


export class CreateCategoryDto {

    @IsString({ message: Message.STRING("$property") })
    @MaxLength(30, { message: Message.MAX_LENGTH("$property", 30) })
    name: string;

    @IsOptional()
    @IsString({ message: Message.STRING("$property") })
    description?: string;

    @IsOptional()
    @IsBoolean({ message: Message.BOOLEAN("$property") })
    status?: boolean;

}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
