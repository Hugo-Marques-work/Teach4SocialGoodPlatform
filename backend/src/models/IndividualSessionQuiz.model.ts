import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { IndividualSessionQuizQuestion } from './IndividualSessionQuizQuestion.model';
import { SessionOrderedModule } from './pack/sessionOrderedModule.model';

@Table
export class IndividualSessionQuiz extends Model {
  @ForeignKey(() => SessionOrderedModule)
  @Column
  sessionOrderedModuleId: number;

  @BelongsTo(() => SessionOrderedModule)
  sessionOrderedModule: SessionOrderedModule;

  @HasMany(()=> IndividualSessionQuizQuestion)
  individualSessionQuizQuestions: IndividualSessionQuizQuestion[]
}