import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const token = await this.authService.login(loginDto);

      if (!token) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      return new SuccessResponseDto('Login successful', { access_token: token });
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  @Post('register')
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      const token = await this.authService.register(createUsuarioDto);

      if (!token) {
        throw new BadRequestException('No se pudo registrar el usuario');
      }

      return new SuccessResponseDto('Registration successful', {
        access_token: token,
      });
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('No se pudo registrar el usuario');
    }
  }
}
