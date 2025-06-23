import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Public()
    @Post("login")
    login(@Body() loginDto: LoginDto) {
        if(loginDto.type)
            return this.authService.loginUser(loginDto)
        else 
            return this.authService.loginClient(loginDto);
    }

}
