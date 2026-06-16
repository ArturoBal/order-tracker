import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { BcryptProvider } from 'src/common/providers/bcrypt/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptProvider: BcryptProvider,
    private readonly jwtService: JwtService,
  ) { }

  async authUser(authDto: AuthDto): Promise<{ access_token: string }> {
    console.log('Authenticating user with email:', authDto.email);
    const user = await this.usersService.findOneByEmailWithPassword(authDto.email);
    console.log('User found:', user);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    console.log('User found:', user);

    const isValid = await this.bcryptProvider.comparePassword(authDto.password, user.password);
    console.log('Password valid:', isValid);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
