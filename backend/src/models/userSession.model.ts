

import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, NotNull } from 'sequelize-typescript';
import { User } from './user.model';
import { ForumGroup } from './forumGroup.model';
import { SessionGroup } from './sessionGroup.model';

@Table
export class UserSession extends Model {
  @ForeignKey(() => SessionGroup)
  @AllowNull(false)
  @Column
  sessionGroupId: number;

  @BelongsTo(() => SessionGroup)
  sessionGroup: SessionGroup;

  @ForeignKey(() => ForumGroup)
  @Column
  forumGroupId: number;

  @BelongsTo(() => ForumGroup)
  forumGroup: ForumGroup;

  @HasOne(() => User)
  user: User

  @Column
  currentStep: number;
}