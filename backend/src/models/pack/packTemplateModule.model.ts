import { Table, Column, Model, HasMany, AllowNull, HasOne, ForeignKey, BelongsTo, Default, DataType } from 'sequelize-typescript';

import { SessionOrderedModule } from './sessionOrderedModule.model';
import { TrainingPack } from './trainingPack.model';

@Table
export class PackTemplateModule extends Model {
  @ForeignKey(() => TrainingPack)
  @AllowNull(false)
  @Column
  trainingPackId: number;

  @BelongsTo(() => TrainingPack)
  trainingPack: TrainingPack;
  
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  order: number;

  @HasOne(()=> SessionOrderedModule)
  sessionOrderedModule: SessionOrderedModule 
}