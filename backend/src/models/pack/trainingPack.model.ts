import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { TrainingSessionName } from './trainingSessionName.model';
import { GeneralResource } from '../generalResource.model';
import { PackTemplateModule } from './packTemplateModule.model';
import { PageInfo } from '../packPages/PageInfo.model';
import { SchoolSessionGroup } from '../schoolSessionGroup.model';

@Table
export class TrainingPack extends Model {
  @AllowNull(false)
  //@Unique
  @Column
  name: string;

  @HasMany(()=> PageInfo)
  pageInfos: PageInfo[];

  @HasMany(()=> TrainingSessionName)
  trainingSessionNames: TrainingSessionName[];

  @HasMany(()=> GeneralResource)
  generalResources: GeneralResource[];

  @HasMany(()=> PackTemplateModule)
  packTemplateModules: PackTemplateModule[];

  @HasMany(()=> SchoolSessionGroup)
  schoolSessionGroups: SchoolSessionGroup[];
}