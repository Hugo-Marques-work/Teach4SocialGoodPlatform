import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne, Unique, Default } from 'sequelize-typescript';

import { Role } from "./role.model";
import { SchoolGroup } from "./schoolGroup.model";
import { UserSession } from "./userSession.model";
import { GlobalForumGroup } from "./globalForumGroup.model";
import { UserResult } from './result/userResult.model';

@Table
export class User extends Model {
  @AllowNull(false)
  @Unique({ name: 'username_unique', msg: 'username_is_unique' })
  @Column
  username: string;

  @AllowNull(false)
  @Unique({ name: 'email_unique', msg: 'email_is_unique' })
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @Default("No School")
  @Column
  school: string;

  @Default("No Code")
  @Column
  code: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => UserResult)
  @Column
  userResultId: number;

  @BelongsTo(() => UserResult)
  userResult: UserResult;

  @ForeignKey(() => SchoolGroup)
  @Column
  schoolGroupId: number;

  @BelongsTo(() => SchoolGroup)
  schoolGroup: SchoolGroup;

  @ForeignKey(() => UserSession)
  @Column
  userSessionId: number;

  @BelongsTo(() => UserSession)
  userSession: UserSession;
  
  @HasMany(() => GlobalForumGroup)
  globalForumGroups: GlobalForumGroup[];
}