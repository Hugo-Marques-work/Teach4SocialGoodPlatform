import { Table, Column, Model, HasMany, HasOne, AllowNull, ForeignKey, BelongsTo, Default, DataType } from 'sequelize-typescript';
import { GeneralResource } from './generalResource.model';

@Table
export class GeneralResourceContent extends Model {
    @ForeignKey(() => GeneralResource)
    @AllowNull(false)
    @Column
    generalResourceId: number;

    @BelongsTo(() => GeneralResource)
    generalResource: GeneralResource;

    @Column
    name: string;

    @AllowNull(false)
    @Column
    content: string;
    
    @AllowNull(false)
    @Column
    contentNumber: number;

    @AllowNull(false)
    @Default(false)
    @Column
    isFile: boolean;

    @Column(DataType.BLOB('long'))
    file: Buffer;
}
