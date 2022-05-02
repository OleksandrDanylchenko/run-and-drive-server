import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthService } from '@auth/auth.service';
import { AuthSignupDto } from '@auth/dto';
import { UsersRepository } from '@auth/entities/user.repository';
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
  ) {}

  async create(dto: AuthSignupDto): Promise<Engineer> {
    await this.authService.signupLocal(dto);

    debugger;

    const user = await this.usersRepository.findOneBy({ email: dto.email });
    return this.engineersRepository.createEngineer(user);
  }
}
