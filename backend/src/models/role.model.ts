import { Table, Column, Model, HasMany, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Role extends Model {
  @AllowNull(false)
  @Column
  name: string;

  @HasMany(() => User)
  users: User[]
}