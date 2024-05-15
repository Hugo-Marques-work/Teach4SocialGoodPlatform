import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, Default } from 'sequelize-typescript';

import { UserModuleResult } from './userModuleResult.model';

@Table
export class UserIndividualQuizResult extends Model {
  @ForeignKey(() => UserModuleResult)
  @Column
  userModuleResultId: number;

  @BelongsTo(() => UserModuleResult)
  userModuleResult: UserModuleResult;

  @AllowNull(false)
  @Column
  questionNumber: number 

  @AllowNull(false)
  @Column
  answer: string 
}