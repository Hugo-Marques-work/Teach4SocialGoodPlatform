import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { PageInfoElement } from './PageInfoElement.model';
import { TrainingPack } from '../pack/trainingPack.model';

@Table
export class PageInfo extends Model {
  @HasMany(()=> PageInfoElement)
  pageInfoElements: PageInfoElement[]

  @ForeignKey(() => TrainingPack)
  @Column
  trainingPackId: number;

  @BelongsTo(() => TrainingPack)
  trainingPack: TrainingPack;

  @Column
  order: number;

  @Column
  pageName: string;
}
