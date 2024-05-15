import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo, Default, DataType } from 'sequelize-typescript';
import { SchoolGroup } from './schoolGroup.model';
import { SessionGroup } from './sessionGroup.model';
import { TrainingPack } from './pack/trainingPack.model';
import { GlobalForumGroup } from './globalForumGroup.model';

@Table
export class SchoolSessionGroup extends Model {
  @ForeignKey(() => TrainingPack)
  @Column
  trainingPackId: number;

  @BelongsTo(() => TrainingPack)
  trainingPack: TrainingPack;

  @ForeignKey(() => SchoolGroup)
  @Column
  schoolGroupId: number;

  @BelongsTo(() => SchoolGroup)
  schoolGroup: SchoolGroup;

  @Column
  name: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT
  })
  notes: string;

  @HasMany(()=> SessionGroup)
  sessionGroups: SessionGroup[]

  @HasMany(() => GlobalForumGroup)
  globalForumGroups: GlobalForumGroup[];
}