import { Table, Column, Model, HasMany, AllowNull, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { IndividualSessionQuiz } from './IndividualSessionQuiz.model';

@Table
export class IndividualSessionQuizQuestion extends Model {
  //Add order later 
  @AllowNull(false)
  @Column
  question: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT
  })
  feedback: string;

  @AllowNull(false)
  @Column
  correctAnswer: boolean;

  @ForeignKey(() => IndividualSessionQuiz)
  @Column
  individualSessionQuizId: number;

  @BelongsTo(() => IndividualSessionQuiz)
  individualSessionQuizzes: IndividualSessionQuiz;
}