import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { Usuario } from 'src/usuarios/usuario.entity'; 

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    try {
      const usuario: Usuario | null = await this.usuariosService.findByCorreo(
        loginDto.correo,
      );
      if (!usuario) return null;

      const isValid = await bcrypt.compare(
        loginDto.contrasena,
        usuario.contrasena,
      );
      if (!isValid) return null;

      const payload = {
        id: usuario.id_usuario, // igual estilo que el ejemplo (id)
        correo: usuario.correo,
        rol: usuario.rol?.nombre ?? null,
      };

      return this.jwtService.sign(payload);
    } catch (err) {
      console.error('Unexpected login error:', err);
      return null;
    }
  }

  async register(createUsuarioDto: CreateUsuarioDto): Promise<string | null> {
    try {
      const usuario: Usuario | null = await this.usuariosService.create(
        createUsuarioDto,
      );
      if (!usuario) return null;

      const payload = {
        id: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol?.nombre ?? null,
      };

      return this.jwtService.sign(payload);
    } catch (err) {
      console.error('Unexpected register error:', err);
      return null;
    }
  }
}
