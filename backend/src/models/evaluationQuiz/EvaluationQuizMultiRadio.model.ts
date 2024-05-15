import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EvaluationQuizOrder } from './EvaluationQuizOrder.model';
import { EvaluationQuizMultiRadioQuestion } from './EvaluationQuizMultiRadioQuestion.model';

@Table
export class EvaluationQuizMultiRadio extends Model {
  @ForeignKey(() => EvaluationQuizOrder)
  @Column
  evaluationQuizOrderId: number;

  @BelongsTo(() => EvaluationQuizOrder)
  evaluationQuizOrder: EvaluationQuizOrder;

  @AllowNull(false)
  @Column
  mainQuestion: string;

  @AllowNull(false)
  @Column
  nOptions: number; //Number of radio options

  @HasMany(()=> EvaluationQuizMultiRadioQuestion)
  evaluationQuizMultiRadioQuestions: EvaluationQuizMultiRadioQuestion[]
}