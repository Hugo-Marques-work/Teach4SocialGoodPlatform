import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, BelongsToMany, HasOne } from 'sequelize-typescript';

import { UserSession } from './userSession.model';
import { UserSessionResult } from './result/userSessionResult.model';

@Table
export class ForumGroup extends Model {
  @HasMany(() => UserSession)
  userSessions: UserSession[];

  //for retrieval of forum groups after the end of session
  @HasMany(() => UserSessionResult)
  userSessionResults: UserSessionResult[];
}