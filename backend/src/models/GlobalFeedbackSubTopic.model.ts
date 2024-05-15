import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { GlobalFeedbackTopic } from './GlobalFeedbackTopic.model';

@Table
export class GlobalFeedbackSubTopic extends Model {
    @AllowNull(false)
    @Column
    topic: string

    @AllowNull(false)
    @Column
    order: number
    
    @BelongsTo(() => GlobalFeedbackTopic)
    globalFeedbackTopic: GlobalFeedbackTopic

    @ForeignKey(() => GlobalFeedbackTopic)
    @AllowNull(false)
    @Column
    globalFeedbackTopicId: number
}
