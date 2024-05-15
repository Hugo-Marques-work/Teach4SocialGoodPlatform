import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EvaluationQuizMultiRadio } from './EvaluationQuizMultiRadio.model';

@Table
export class EvaluationQuizMultiRadioQuestion extends Model {
  @ForeignKey(() => EvaluationQuizMultiRadio)
  @Column
  evaluationQuizMultiRadioId: number;

  @BelongsTo(() => EvaluationQuizMultiRadio)
  evaluationQuizMultiRadio: EvaluationQuizMultiRadio;

  @AllowNull(false)
  @Column
  question: string;
}