import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { InfoModule } from './InfoModule.model';

@Table
export class InfoModuleElement extends Model {
  @Column({
    type: DataType.TEXT
  })
  text: string
  
  @Column
  line: boolean

  @Column
  box: boolean

  @AllowNull(false)
  @Column
  order: number

  @BelongsTo(() => InfoModule)
  infoModule: InfoModule

  @ForeignKey(() => InfoModule)
  @Column
  infoModuleId: number
}
