import { IsEnum, IsOptional } from 'class-validator';

export enum TripState {
  'IN_PROGRESS' = 'IN_PROGRESS',
  'ENDED' = 'ENDED',
}

export class FindAllFilterDto {
  @IsOptional()
  @IsEnum(TripState)
  state?: TripState;
}
