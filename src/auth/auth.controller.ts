import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private userService: AuthService) {}
    @Post('/signup')
  createUser(@Body() createUserDto: AuthCredentialDto): Promise<void> {
    return this.userService.createUser(createUserDto);
  }

}
