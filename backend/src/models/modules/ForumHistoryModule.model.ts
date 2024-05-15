import { Table, Column, Model, HasMany, HasOne, AllowNull, BelongsTo, ForeignKey, Default } from 'sequelize-typescript';
import { SessionOrderedModule } from '../pack/sessionOrderedModule.model';
import { InfoModuleElement } from './InfoModuleElement.model';

@Table
export class ForumHistoryModule extends Model {
  @ForeignKey(() => SessionOrderedModule)
  @Column
  sessionOrderedModuleId: number;

  @BelongsTo(() => SessionOrderedModule)
  sessionOrderedModule: SessionOrderedModule;
  
  @Default(-1)
  @Column
  linkedStep: number
}
