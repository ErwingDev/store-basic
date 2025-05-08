import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";
import { Message } from "../decorators/message.decorator";

export class CreateCategoryDto {

    @IsString({ message: Message.STRING("$property") })
    @MaxLength(30, { message: Message.MAX_LENGTH("$property", 30) })
    name: string;

    @IsOptional()
    @IsString({ message: Message.STRING("$property") })
    description?: string | null;

    @IsOptional()
    @IsBoolean({ message: Message.BOOLEAN("$property") })
    status?: boolean | null;

}

export class UpdateCategoryDto {

    @IsString({ message: Message.STRING("$property") })
    @MaxLength(30, { message: Message.MAX_LENGTH("$property", 30) })
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsString({ message: Message.STRING("$property") })
    description?: string | null;

    @IsOptional()
    @IsBoolean({ message: Message.BOOLEAN("$property") })
    status?: boolean;

}