import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { DetonationSession } from './detonationSession.model';

@Table
export class DetonationQuestion extends Model {
    @AllowNull(false)
    @Column
    content: string

    @AllowNull(false)
    @Column
    order: number

    @BelongsTo(() => DetonationSession)
    detonationSession: DetonationSession

    @ForeignKey(() => DetonationSession)
    @AllowNull(false)
    @Column
    detonationSessionId: number
}
