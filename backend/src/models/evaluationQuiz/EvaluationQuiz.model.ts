import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EvaluationQuizOrder } from './EvaluationQuizOrder.model';
import { SessionOrderedModule } from '../pack/sessionOrderedModule.model';

@Table
export class EvaluationQuiz extends Model {
  @ForeignKey(() => SessionOrderedModule)
  @Column
  sessionOrderedModuleId: number;

  @BelongsTo(() => SessionOrderedModule)
  sessionOrderedModule: SessionOrderedModule;

  @HasMany(()=> EvaluationQuizOrder)
  evaluationQuizOrders: EvaluationQuizOrder[]
}