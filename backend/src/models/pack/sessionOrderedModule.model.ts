import { Table, Column, Model, HasMany, AllowNull, HasOne, ForeignKey, BelongsTo, Default, DataType } from 'sequelize-typescript';
import { IndividualSessionQuiz } from '../IndividualSessionQuiz.model';
import { EvaluationQuiz } from '../evaluationQuiz/EvaluationQuiz.model';
import { DetonationSession } from '../detonationSession.model';
import { GlobalFeedbackTopic } from '../GlobalFeedbackTopic.model';
import { TrainingSessionStep } from './trainingSessionStep.model';
import { PackTemplateModule } from './packTemplateModule.model';
import { InfoModule } from '../modules/InfoModule.model';
import { ForumHistoryModule } from '../modules/ForumHistoryModule.model';
import { IndividualQuizFeedbackModule } from '../modules/IndividualQuizFeedbackModule.model';

@Table
export class SessionOrderedModule extends Model {
  @ForeignKey(() => TrainingSessionStep)
  @Column
  trainingSessionStepId: number;

  @BelongsTo(() => TrainingSessionStep)
  trainingSessionStep: TrainingSessionStep;

  @ForeignKey(() => PackTemplateModule)
  @Column
  packTemplateModuleId: number;

  @BelongsTo(() => PackTemplateModule)
  packTemplateModule: PackTemplateModule;

  @AllowNull(false)
  @Column
  order: number;

  
  //modules
  @HasOne(() => IndividualSessionQuiz)
  individualSessionQuiz: IndividualSessionQuiz
  
  @HasOne(() => EvaluationQuiz)
  evaluationQuiz: EvaluationQuiz
  
  @HasOne(() => DetonationSession)
  detonationSession: DetonationSession

  @HasOne(()=> GlobalFeedbackTopic)
  globalFeedbackTopic: GlobalFeedbackTopic
  
  @HasOne(() => InfoModule)
  infoModule: InfoModule

  @HasOne(() => ForumHistoryModule)
  forumHistoryModule: ForumHistoryModule

  @HasOne(() => IndividualQuizFeedbackModule)
  individualQuizFeedbackModule: IndividualQuizFeedbackModule
}