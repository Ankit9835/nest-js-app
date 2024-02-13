import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private userService: AuthService) {}
    @Post('/signup')
  createUser(@Body() createUserDto: AuthCredentialDto): Promise<void> {
    return this.userService.createUser(createUserDto);
  }

  @Post('/signin')
  signIn(@Body() createUserDto: AuthCredentialDto): Promise<{accessToken: string}> {
    return this.userService.logIn(createUserDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req){
    console.log(req)
  }

}
