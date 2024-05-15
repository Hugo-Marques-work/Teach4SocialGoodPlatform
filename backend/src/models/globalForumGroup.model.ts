import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, BelongsToMany, HasOne } from 'sequelize-typescript';

import { User } from './user.model';
import { SchoolGroup } from './schoolGroup.model';
import { SchoolSessionGroup } from './schoolSessionGroup.model';

@Table
export class GlobalForumGroup extends Model {
  @ForeignKey(() => SchoolSessionGroup)
  @Column
  schoolSessionGroupId: number;

  @BelongsTo(() => SchoolSessionGroup)
  schoolSessionGroup: SchoolSessionGroup;
  
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  groupOrder: number
}