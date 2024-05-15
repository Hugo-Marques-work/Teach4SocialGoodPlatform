import { DataType, Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, Default } from 'sequelize-typescript';

import { UserEvaluationQuizResult } from './userEvaluationQuizResult.model';
import { UserIndividualQuizResult } from './userIndividualQuizResult.model';
import { UserSessionResult } from './userSessionResult.model';
import { ForumMessage } from '../forumMessage.model';

@Table
export class UserModuleResult extends Model {
  @ForeignKey(() => UserSessionResult)
  @Column
  userSessionResultId: number;

  @BelongsTo(() => UserSessionResult)
  userSessionResult: UserSessionResult;

  @Column
  order: number;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT
  })
  fullMessages: string;

  @HasMany(() => UserIndividualQuizResult)
  userIndividualQuizResults: UserIndividualQuizResult[];

  @HasMany(() => UserEvaluationQuizResult)
  userEvaluationQuizResults: UserEvaluationQuizResult[];
  
  @HasMany(() => ForumMessage)
  forumMessages: ForumMessage[];
}