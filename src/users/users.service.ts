import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptProvider } from 'src/common/providers/bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private bcryptProvider: BcryptProvider
  ) { }


  async create(createUserDto: CreateUserDto) {

    const { name, email, password, role } = createUserDto;
    const exists = await this.userExists(email);
    if (exists) throw new BadRequestException('User already exists');

    const created = this.usersRepository.create({
      name: name,
      email: email,
      password: await this.bcryptProvider.hashPassword(password),
      role: role
    });

    return this.usersRepository.save(created);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  async remove(id: string) {
    return this.usersRepository.delete({ id });
  }

  async findOneByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
      where: { email },
    });
  }

  private async userExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ email });
    return !!user;
  }
}
