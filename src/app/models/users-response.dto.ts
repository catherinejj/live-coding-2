import { UserDto } from './user.dto';

export interface UsersResponseDto {
  readonly users: UserDto[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}
