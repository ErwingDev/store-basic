import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Message } from "src/common/decorators/message.decorator";

export class LoginDto {

    @IsEmail({}, { message: Message.EMAIL("$property") })
    email: string;

    @IsString({ message: Message.STRING("$property") })
    @MinLength(6, { message: Message.MIN_LENGTH("$property", 6) })
    @Transform(({ value }) => value.trim())
    password: string;

    @IsString({ message: Message.STRING("$property") })
    @IsOptional()
    type?: string | '';

}