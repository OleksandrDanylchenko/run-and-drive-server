import { Engineer } from '../entities/engineer.entity';

export type CreateEngineerResponseDto = Omit<Engineer, 'user'>;
