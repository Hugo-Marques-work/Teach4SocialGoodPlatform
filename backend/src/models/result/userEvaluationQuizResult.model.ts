import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, Default, DataType } from 'sequelize-typescript';

import { UserModuleResult } from './userModuleResult.model';

@Table
export class UserEvaluationQuizResult extends Model {
  @ForeignKey(() => UserModuleResult)
  @Column
  userModuleResultId: number;

  @BelongsTo(() => UserModuleResult)
  userModuleResult: UserModuleResult;

  @AllowNull(false)
  @Column
  questionNumber: number 

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  questionSubNumber: number | null

  @AllowNull(false)
  @Column
  answer: string 
}