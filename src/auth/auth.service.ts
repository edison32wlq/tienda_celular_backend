import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.findByCorreo(loginDto.correo);

    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const passwordOk = await bcrypt.compare(
      loginDto.contrasena,
      usuario.contrasena,
    );

    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id_usuario, 
      correo: usuario.correo,
      rol: usuario.rol?.nombre ?? null,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.create(createUsuarioDto);
    if (!usuario)
      throw new UnauthorizedException('No se pudo crear el usuario');

    const payload = {
      sub: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol?.nombre ?? null,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
