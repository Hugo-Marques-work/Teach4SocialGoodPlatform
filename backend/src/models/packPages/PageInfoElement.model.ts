import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { PageInfo } from './PageInfo.model';

@Table
export class PageInfoElement extends Model {
  @Column
  text: string

  @Column
  line: boolean

  @Column
  box: boolean

  @AllowNull(false)
  @Column
  order: number

  @BelongsTo(() => PageInfo)
  pageInfo: PageInfo

  @ForeignKey(() => PageInfo)
  @Column
  pageInfoId: number
}
