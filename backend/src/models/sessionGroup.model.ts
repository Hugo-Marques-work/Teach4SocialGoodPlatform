import { Table, Column, Model, HasMany, AllowNull, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { UserSession } from './userSession.model';
import { TrainingSessionName } from './pack/trainingSessionName.model';
import { SchoolSessionGroup } from './schoolSessionGroup.model';
import { UserSessionResult } from './result/userSessionResult.model';

@Table
export class SessionGroup extends Model {
  @ForeignKey(() => TrainingSessionName)
  @Column
  trainingSessionNameId: number;

  @BelongsTo(() => TrainingSessionName)
  trainingSessionName: TrainingSessionName;

  @ForeignKey(() => SchoolSessionGroup)
  @Column
  schoolSessionGroupId: number;

  @BelongsTo(() => SchoolSessionGroup)
  schoolSessionGroup: SchoolSessionGroup;

  @AllowNull(true)
  @Column
  finishTime: Date;

  @Default(0)
  @Column
  phaseNumber: number;
  
  //tryToRemove
  @Column
  name: string;

  @Default(0)
  @Column
  repeated: number;
  
  @HasMany(()=> UserSession)
  userSessions: UserSession[]

  @HasMany(() => UserSessionResult)
  userSessionResults: UserSessionResult[] 

  @Column
  currentStep: number;

  @Column
  finished: boolean;
}