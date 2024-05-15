import { Table, Column, Model, HasMany, HasOne, AllowNull, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { GeneralResourceContent } from './generalResourceContent.model';
import { TrainingPack } from './pack/trainingPack.model';

@Table
export class GeneralResource extends Model {
    @ForeignKey(() => TrainingPack)
    @Column
    trainingPackId: number;

    @BelongsTo(() => TrainingPack)
    trainingPack: TrainingPack;
    
    @AllowNull(false)
    @Column
    name: string;

    @Column
    description: string;

    @AllowNull(false)
    @Column
    resourceNumber: number;

    @HasMany(() => GeneralResourceContent)
    contents: GeneralResourceContent[]
}
