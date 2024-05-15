import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { TrainingSessionName } from './pack/trainingSessionName.model';

@Table
export class SessionResource extends Model {
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  content: string

  @AllowNull(false)
  @Column
  resourceNumber: number;
  
  @Column(DataType.BLOB('long'))
  file: Buffer;
  
  @ForeignKey(() => TrainingSessionName)
  @Column
  trainingSessionNameId: number;

  @BelongsTo(() => TrainingSessionName)
  trainingSessionName: TrainingSessionName;
}
