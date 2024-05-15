import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { DetonationQuestion } from './detonationQuestion.model';
import { SessionOrderedModule } from './pack/sessionOrderedModule.model';

@Table
export class DetonationSession extends Model {
  @HasMany(()=> DetonationQuestion)
  detonationQuestions: DetonationQuestion[]

  @ForeignKey(() => SessionOrderedModule)
  @Column
  sessionOrderedModuleId: number;

  @BelongsTo(() => SessionOrderedModule)
  sessionOrderedModule: SessionOrderedModule;
}
