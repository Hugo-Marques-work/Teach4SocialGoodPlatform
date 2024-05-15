import { Table, Column, Model, HasMany, AllowNull, HasOne, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { TrainingSessionName } from './trainingSessionName.model';

@Table
export class TrainingSessionRestriction extends Model {
  @ForeignKey(() => TrainingSessionName)
  @AllowNull(false)
  @Column
  trainingSessionNameId: number;

  @BelongsTo(() => TrainingSessionName)
  trainingSessionName: TrainingSessionName;

  @AllowNull(false)
  @Column
  step: number;

  @AllowNull(false)
  @Column
  minutes: number;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT
  })
  description: string;

  @AllowNull(false)
  @Column
  order: number;
}