import { Table, Column, Model, HasMany, AllowNull, HasOne, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { TrainingSessionName } from './trainingSessionName.model';
import { SessionOrderedModule } from './sessionOrderedModule.model';

@Table
export class TrainingSessionStep extends Model {
  @ForeignKey(() => TrainingSessionName)
  @AllowNull(false)
  @Column
  trainingSessionNameId: number;

  @BelongsTo(() => TrainingSessionName)
  trainingSessionName: TrainingSessionName;

  @AllowNull(false)
  @Column
  name: string;
  
  @AllowNull(false)
  @Column
  order: number;

  @Default(false)
  @Column
  split: boolean;

  @Default(false)
  @Column
  optional: boolean;

  @Default(false)
  @Column
  timerStep: boolean;

  @Default(0)
  @Column
  timeToPhase: number;

  @Default(false)
  @Column
  sessionResources: boolean;

  @Default(false)
  @Column
  generalResources: boolean;

  @HasMany(()=> SessionOrderedModule)
  sessionOrderedModules: SessionOrderedModule[]  
}