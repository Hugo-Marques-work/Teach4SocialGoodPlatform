import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { EvaluationQuiz } from './EvaluationQuiz.model';
import { EvaluationQuizQuestion } from './EvaluationQuizQuestion.model';
import { EvaluationQuizMultiRadio } from './EvaluationQuizMultiRadio.model';
import { EvaluationQuizMultipleAnswer } from './EvaluationQuizMultipleAnswer.model';
import { EvaluationQuizSingleRadio } from './EvaluationQuizSingleRadio.model';
@Table
export class EvaluationQuizOrder extends Model {
  @ForeignKey(() => EvaluationQuiz)
  @Column
  evaluationQuizId: number;

  @BelongsTo(() => EvaluationQuiz)
  evaluationQuiz: EvaluationQuiz;

  @AllowNull(false)
  @Column
  order: number;

  @HasOne(()=> EvaluationQuizQuestion)
  evaluationQuizQuestion: EvaluationQuizQuestion

  @HasOne(()=> EvaluationQuizMultiRadio)
  evaluationQuizMultiRadio: EvaluationQuizMultiRadio
  
  @HasOne(()=> EvaluationQuizMultipleAnswer)
  evaluationQuizMultipleAnswer: EvaluationQuizMultipleAnswer

  @HasOne(()=> EvaluationQuizSingleRadio)
  evaluationQuizSingleRadio: EvaluationQuizSingleRadio
}