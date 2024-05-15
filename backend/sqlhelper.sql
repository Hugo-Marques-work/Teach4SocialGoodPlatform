Update UserSessionResults set trainingSessionNameId = 133 where trainingSessionNameId is null and sessionNameId=2;
Update UserSessionResults set trainingSessionNameId = 134 where trainingSessionNameId is null and sessionNameId=3;
Update UserSessionResults set trainingSessionNameId = 135 where trainingSessionNameId is null and sessionNameId=4;
Update UserSessionResults set trainingSessionNameId = 136 where trainingSessionNameId is null and sessionNameId=5;
Update UserSessionResults set trainingSessionNameId = 137 where trainingSessionNameId is null and sessionNameId=6;



select id, sessionNameId, trainingSessionNameId from UserSessionResults;

alter table GlobalFeedbackTopics modify sessionNameId int(11) DEFAULT NULL;

alter table DetonationSessions modify sessionNameId int(11) DEFAULT NULL;


show create table UserSessionResults;
update UserSessionResults set sessionNameId = null;





Update IndividualSessionQuizzes set sessionOrderedModule = 335 where trainingSessionNameId is null and sessionNameId=2;
Update UserSessionResults set trainingSessionNameId = 134 where trainingSessionNameId is null and sessionNameId=3;
Update UserSessionResults set trainingSessionNameId = 135 where trainingSessionNameId is null and sessionNameId=4;
Update UserSessionResults set trainingSessionNameId = 136 where trainingSessionNameId is null and sessionNameId=5;
Update UserSessionResults set trainingSessionNameId = 137 where trainingSessionNameId is null and sessionNameId=6;



Individual Quizzes 
 select * from TrainingSessionSteps where trainingSessionNameId > 132 AND `order` = 0;

Evaluation

select * from TrainingSessionSteps where trainingSessionNameId > 132 AND `order` = 1;

Forum (detonationSession)

select * from TrainingSessionSteps where trainingSessionNameId > 132 AND `order` = 2;



select   TrainingSessionSteps.id as trainingStepsId,   TrainingSessionSteps.trainingSessionNameId,   TrainingSessionSteps.order as stepOrder,   SessionOrderedModules.id as moduleId from   TrainingSessionSteps   join SessionOrderedModules on SessionOrderedModules.`trainingSessionStepId` = TrainingSessionSteps.id   and trainingSessionNameId > 132   and TrainingSessionSteps.order = 2;



Reuniao dia 18

Devia listar as coisas que agora sao possiveis, que nao eram possiveis antes,
por exemplo antes nunca era possivel ter 2 quizes individuais, etcs

Devia ter uma demo e daqui a 15 dias devia ser obvio o que foi feito com a nova demo

//helper

hasChallengeblank