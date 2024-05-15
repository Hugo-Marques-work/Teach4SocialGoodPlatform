import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { SessionOrderedModule } from '../pack/sessionOrderedModule.model';
import { InfoModuleElement } from './InfoModuleElement.model';

@Table
export class InfoModule extends Model {
  @HasMany(()=> InfoModuleElement)
  infoModuleElements: InfoModuleElement[]

  @ForeignKey(() => SessionOrderedModule)
  @Column
  sessionOrderedModuleId: number;

  @BelongsTo(() => SessionOrderedModule)
  sessionOrderedModule: SessionOrderedModule;
  
}
