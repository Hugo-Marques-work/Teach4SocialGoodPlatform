import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { GlobalFeedbackSubTopic } from './GlobalFeedbackSubTopic.model';
import { SessionOrderedModule } from './pack/sessionOrderedModule.model';

@Table
export class GlobalFeedbackTopic extends Model {
  @AllowNull(false)
  @Column
  mainTopic: string

  @AllowNull(true)
  @Column
  descriptionTopic: boolean
  
  @ForeignKey(() => SessionOrderedModule)
  @Column
  sessionOrderedModuleId: number;

  @BelongsTo(() => SessionOrderedModule)
  sessionOrderedModule: SessionOrderedModule;
  
  @HasMany(()=> GlobalFeedbackSubTopic)
  globalFeedbackSubTopics: GlobalFeedbackSubTopic[]
}
