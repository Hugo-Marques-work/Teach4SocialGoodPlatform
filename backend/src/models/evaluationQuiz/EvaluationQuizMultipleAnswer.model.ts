import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EvaluationQuizOrder } from './EvaluationQuizOrder.model';

@Table
export class EvaluationQuizMultipleAnswer extends Model {
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
  nAnswers: number; //Number of answers
}