import { Table, Column, Model, HasMany, AllowNull, HasOne } from 'sequelize-typescript';
import { User } from './user.model';
import { SchoolSessionGroup } from './schoolSessionGroup.model';

@Table
export class SchoolGroup extends Model {
  @AllowNull(false)
  @Column
  name: string;
  
  @AllowNull(false)
  @Column
  identifier: string;
  
  @HasMany(() => User)
  users: User[]

  @HasOne(()=> SchoolSessionGroup)
  schoolSessionGroup: SchoolSessionGroup;
}