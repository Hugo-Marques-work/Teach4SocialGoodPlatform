import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EvaluationQuizOrder } from './EvaluationQuizOrder.model';

@Table
export class EvaluationQuizSingleRadio extends Model {
  @ForeignKey(() => EvaluationQuizOrder)
  @Column
  evaluationQuizOrderId: number;

  @BelongsTo(() => EvaluationQuizOrder)
  evaluationQuizOrder: EvaluationQuizOrder;

  @AllowNull(false)
  @Column
  question: string;

  @AllowNull(false)
  @Column
  nOptions: number; //Number of radio options
}