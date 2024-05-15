import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, BelongsToMany, AllowNull } from 'sequelize-typescript';

import { User } from './user.model';
import { UserModuleResult } from './result/userModuleResult.model';

@Table
export class ForumMessage extends Model {
  @ForeignKey(() => UserModuleResult)
  @Column
  userModuleResultId: number;

  @BelongsTo(() => UserModuleResult)
  userModuleResult: UserModuleResult;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  step: number;

  @AllowNull(false)
  @Column
  content: string

  @AllowNull(false)
  @Column
  messageNumber: number
}