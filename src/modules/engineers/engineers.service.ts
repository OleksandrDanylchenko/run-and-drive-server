import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthService } from '@auth/auth.service';
import { AuthSignupDto } from '@auth/dto';
import { User } from '@auth/entities/user.entity';
import { UsersRepository } from '@auth/entities/user.repository';
import { UsersService } from '@auth/users.service';
import { GetEngineerDto } from '@engineers/dto/get-engineer.dto';
import { Engineer } from '@engineers/entities/engineer.entity';

import { EngineersRepository } from './entities/engineer.repository';

@Injectable()
export class EngineersService {
  constructor(
    @InjectRepository(EngineersRepository)
    private readonly engineersRepository: EngineersRepository,
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async get(engineerId: string): Promise<Engineer> {
    return this.engineersRepository.getEngineer(engineerId);
  }

  async findOne(engineerId: string): Promise<GetEngineerDto> {
    const engineer = await this.get(engineerId);
    const { employeeNumber, user_id } = engineer;
    const userDto = await this.usersService.findOne(user_id);
    return {
      employeeNumber,
      user: userDto,
    };
  }

  async create(dto: AuthSignupDto): Promise<Engineer> {
    await this.authService.signupLocal(dto);

    const user = await this.usersRepository.findOneBy({ email: dto.email });
    return this.engineersRepository.createEngineer(user);
  }
}
