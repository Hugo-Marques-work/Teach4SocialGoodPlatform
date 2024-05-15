import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, Default, DataType } from 'sequelize-typescript';

import { UserSessionResult } from './userSessionResult.model';

@Table
export class UserResourceClickResult extends Model {
  @ForeignKey(() => UserSessionResult)
  @AllowNull(false)
  @Column
  userSessionResultId: number;

  @BelongsTo(() => UserSessionResult)
  userSessionResult: UserSessionResult;

  @AllowNull(false)
  @Column
  resourceNumber: number;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  resourceSubNumber: number | null;

  @AllowNull(false)
  @Column
  isSessionResource: boolean;
}