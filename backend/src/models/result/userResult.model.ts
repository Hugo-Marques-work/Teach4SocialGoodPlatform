import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, Default } from 'sequelize-typescript';

import { User } from '../user.model';
import { UserSessionResult } from './userSessionResult.model';

@Table
export class UserResult extends Model {
  @HasOne(() => User)
  user: User;

  @HasMany(() => UserSessionResult)
  userSessionResults: UserSessionResult[];
}