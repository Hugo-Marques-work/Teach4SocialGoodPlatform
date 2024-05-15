import { Table, Column, Model, HasMany, AllowNull, HasOne, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { SessionResource } from '../sessionResource.model';
import { SessionGroup } from '../sessionGroup.model';
import { UserSessionResult } from '../result/userSessionResult.model';
import { TrainingSessionStep } from './trainingSessionStep.model';
import { TrainingPack } from './trainingPack.model';
import { TrainingSessionRestriction } from './trainingSessionRestriction.model';

@Table
export class TrainingSessionName extends Model {
  @ForeignKey(() => TrainingPack)
  @AllowNull(false)
  @Column
  trainingPackId: number;

  @BelongsTo(() => TrainingPack)
  trainingPack: TrainingPack;
  
  @AllowNull(false)
  @Column
  name: string;
  
  @AllowNull(false)
  @Column
  order: number;

  @Default(0)
  @Column
  sessionTime: number;

  @HasMany(()=> SessionGroup)
  sessionGroups: SessionGroup[]
  
  @HasMany(()=> TrainingSessionStep)
  trainingSessionSteps: TrainingSessionStep[]  
  
  @HasMany(()=> SessionResource)
  sessionResources: SessionResource[]

  @HasMany(()=> TrainingSessionRestriction)
  trainingSessionRestrictions: TrainingSessionRestriction[]
}