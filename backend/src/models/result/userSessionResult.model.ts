import { DataType, Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, Default } from 'sequelize-typescript';

import { UserResult } from './userResult.model';
import { UserResourceClickResult } from './userResourceClickResult.model';
import { ForumGroup } from '../forumGroup.model';
import { UserModuleResult } from './userModuleResult.model';
import { SessionGroup } from '../sessionGroup.model';

@Table
export class UserSessionResult extends Model {
  @ForeignKey(() => UserResult)
  @AllowNull(false)
  @Column
  userResultId: number;

  @BelongsTo(() => UserResult)
  userResult: UserResult;

  @ForeignKey(() => SessionGroup)
  @Column
  sessionGroupId: number;

  @BelongsTo(() => SessionGroup)
  sessionGroup: SessionGroup;

  //Module Results
  @HasMany(() => UserModuleResult)
  userModuleResults: UserModuleResult[];

  //Session Results
  @HasMany(() => UserResourceClickResult)
  userResourceClickResults: UserResourceClickResult[];
  
  @ForeignKey(() => ForumGroup)
  @Column
  forumGroupId: number;

  @BelongsTo(() => ForumGroup)
  forumGroup: ForumGroup;
}