import { Request, Response } from "express-serve-static-core";
import writeXlsxFile from 'write-excel-file/node'; 
import { User } from "../models/user.model";
import { defConsts } from "../defConsts";
import { TrainingPack } from "../models/pack/trainingPack.model";
import { ResError } from "../models/miscModels/ResError";
import { SchoolSessionGroup } from "@/models/schoolSessionGroup.model";
import { getSessionFromPack, handleGetPackStepError } from "./genericAux.controller";
import { TrainingSessionName } from "@/models/pack/trainingSessionName.model";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { moduleControls } from "./module.controller";
import { UserResourceClickResult } from "@/models/result/userResourceClickResult.model";

class Schema {
  column: string;
  type: StringConstructor | NumberConstructor;
  value: (obj: any) => any;

  constructor(obj: Schema) {
    if(obj) {
      this.column = obj.column;
      this.type = obj.type;
      this.value = obj.value;
    }
  }
} 

export async function getSessionExcelData(req: Request, res: Response) {
  let sGroupName = req.params.groupName;
  let fakeSessionIndex = req.params.sessionIndex;
  let sessionIndex = Number.parseInt(fakeSessionIndex);

  //get all necessary objects 
  let schoolSessionGroup = null as null | SchoolSessionGroup;
  let trainingPack = null as null | TrainingPack;
  let trainingSessionName = null as null | TrainingSessionName;
  try {
    schoolSessionGroup = await SchoolSessionGroup.findOne({
      where: { name: sGroupName }
    });
    if(!schoolSessionGroup) {
      throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid School Session Group");
    }

    trainingPack = await schoolSessionGroup.$get('trainingPack');
    if(!trainingPack) {
      throw new ResError(defConsts.STATUS_SERVER_ERROR, "School Session Group is invalid");
    }

    trainingSessionName = await getSessionFromPack(trainingPack, fakeSessionIndex);
  } 
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  //Base values
  let baseSchema = [
    new Schema({
      column: 'Código do participante',
      type: String,
      value: (obj: any) => obj['Código do participante']
    }),
    new Schema({
      column: 'Participante',
      type: Number,
      value: (obj: any) => obj['Participante']
    }),
    new Schema({
      column: 'Sessão',
      type: Number,
      value: (obj: any) => obj['Sessão']
    }),
  ];
  const stepBaseName = "Passo_";
  const generalResourceBaseName = 'Recurso_Generalista_';
  const sessionResourceBaseName = 'Recurso_Sessão_';
  
  //Schema variables
  let schemaSheets = [] as Schema[][];
  let sheetNames = [] as string[];
  
  
  let groups = await schoolSessionGroup.$get('sessionGroups', { where: {
    trainingSessionNameId: trainingSessionName.id,
    schoolSessionGroupId: schoolSessionGroup.id,
  },
    order: [["repeated","ASC"]]
  });

  //create a map in case repeated have gaps in order
  let groupRepeatedMapIndex = {} as any;
  for(let i = 0; i < groups.length; i++) {
    if(groupRepeatedMapIndex[groups[i].repeated]) {
      res.status(defConsts.STATUS_SERVER_ERROR).send('Multiple session groups have the same repeat index');
      return; 
    }
    groupRepeatedMapIndex[groups[i].repeated] = i;
    sheetNames.push(i.toString());
    schemaSheets.push([]);
  }

  //create and extend the base schema for every execution of the session
  for(let i = 0; i < groups.length; i++) {
    await extendSchema(trainingPack, sessionIndex, i);
  }

  let users = await User.findAll({order: [['code', 'ASC']]});

  //prepare the results
  let resFinal = [] as any[][];
  for(let i = 0; i < groups.length; i++) {
    resFinal.push([]);
  }

  //get user results
  for(let user of users) {
    let schoolGroup = await user.$get('schoolGroup');
    if(schoolGroup) {
      let userInfo = {
        'Código do participante': user.code,
        'Participante': user.id,
      }
      await extendWithUserResults(schoolSessionGroup, sessionIndex, userInfo, user, resFinal);
    }
  }

  //write the file
  const stream = await writeXlsxFile(resFinal, {
    schema: schemaSheets,
    sheets: sheetNames
  });
  
  //output the file
  stream.pipe(res);
  console.log('piped');

  
  //
  // --------------------- Auxiliary ---------------------
  //

  async function extendWithUserResults(schoolSessionGroup: SchoolSessionGroup, sessionIndex: number, userInfo: any, user: User, resFinal: any[][]) {
    let userResult = await user.$get('userResult');
    if(!userResult) return;
    let sessionResults = await userResult.$get('userSessionResults');
    
    for(let sessionResult of sessionResults) {
      //get necessary objects
      let userSessionGroup = await sessionResult.$get('sessionGroup');
      if(!userSessionGroup) continue;
      let userSchoolSessionGroup = await userSessionGroup.$get('schoolSessionGroup');
      if(!userSchoolSessionGroup || userSchoolSessionGroup.id != schoolSessionGroup.id) continue;
      let repeatIndex = groupRepeatedMapIndex[userSessionGroup.repeated];
      if(repeatIndex === undefined) continue;

      
      let userResultInfo = Object.assign({}, userInfo);
      userResultInfo['Sessão'] = sessionIndex + 1;

      let moduleResults = await sessionResult.$get('userModuleResults',{
        order: [["order","ASC"]]
      });

      //get module results
      for(let moduleResult of moduleResults) {
        let stepIndex = moduleResult.order;

        let exportResults = await moduleControls.orderedModule.getResults(moduleResult);
        for(let exportResult of exportResults) {
          userResultInfo[getFullModuleName(stepIndex, exportResult.name)] = exportResult.result;
        }
      }
      
      //get resource results
      let resourceClickResults = await sessionResult.$get('userResourceClickResults', {
        order: [
          ['isSessionResource', 'DESC'], //starts with session resources
          ['resourceNumber', 'ASC'],
          ['resourceSubNumber', 'ASC']
        ]
      });
      for(let resource of resourceClickResults) {
        let resourceExportName = getExportResourceName(resource);
        userResultInfo[resourceExportName] = 1;
      }

      resFinal[repeatIndex].push(userResultInfo);
    }
  }
  
  //
  // --------------------- Create Schema ---------------------
  //

  async function extendSchema(trainingPack: TrainingPack, sessionNumber: number, repeatedIndex: number) {
    let trainingSessionNames = await trainingPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
    if(sessionNumber < 0 || sessionNumber >= trainingSessionNames.length) {
      throw new ResError(defConsts.STATUS_SERVER_ERROR, "couldn't find session");
    }
    let trainingSessionName = trainingSessionNames[sessionNumber];

    //create a copy of the base for this session execution
    schemaSheets[repeatedIndex] = Object.assign([], baseSchema);

    let trainingSessionSteps = await trainingSessionName.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
    
    //create schema for modules with results
    for(let stepIndex = 0; stepIndex < trainingSessionSteps.length; stepIndex++) {
      let trainingSessionStep = trainingSessionSteps[stepIndex];

      let oModules = await trainingSessionStep.$get('sessionOrderedModules', {
        order: [["order", "ASC"]]
      });
      for(let oModule of oModules) {
        await createModuleSchema(oModule, repeatedIndex, stepIndex);
      }
    }

    //create schema for resource results (clicks)
    await createSessionResourceSchema(trainingSessionName, repeatedIndex);
    await createGeneralResourceSchema(trainingPack, repeatedIndex);
  }

  async function createModuleSchema(oModule: SessionOrderedModule, repeatedIndex: number, stepIndex: number) {
    let schema = schemaSheets[repeatedIndex];

    let exportValues = await moduleControls.orderedModule.getModuleExportName(oModule);
    let finalExportValues = getModuleExportNames(stepIndex, exportValues);
    for(let finalExportValue of finalExportValues) {
      schema.push(new Schema({
        column: finalExportValue.name,
        type: finalExportValue.type,
        value: (obj: any) => obj[finalExportValue.name]
      }))
    }
  }
  
  async function createSessionResourceSchema(trainingSessionName: TrainingSessionName, repeatedIndex: number) {
    let schema = schemaSheets[repeatedIndex];

    let sessionResources = await trainingSessionName.$get('sessionResources',{
      order: [['resourceNumber', 'ASC']]
    });
    for(let index in sessionResources) {
      schema.push(new Schema({
        column: getSessionResourceName(parseInt(index)),
        type: Number,
        value: (obj: any) => obj[getSessionResourceName(parseInt(index))]
      }));
    }
  }
  async function createGeneralResourceSchema(trainingPack: TrainingPack, repeatedIndex: number) {
    let schema = schemaSheets[repeatedIndex];

    let generalResources = await trainingPack.$get('generalResources',{
      order: [['resourceNumber', 'ASC']]
    });
    for(let index in generalResources) {
      let generalResource = generalResources[index];
      let contents = await generalResource.$get('contents');

      if(contents.length == 1) {
        schema.push(new Schema({
          column: getGeneralResourceName(parseInt(index)),
          type: Number,
          value: (obj: any) => obj[getGeneralResourceName(parseInt(index))]
        }));
        continue;
      }
      for(let contentIndex in contents) {
        schema.push(new Schema({
          column: getGeneralResourceName(parseInt(index), parseInt(contentIndex)),
          type: Number,
          value: (obj: any) => obj[getGeneralResourceName(parseInt(index), parseInt(contentIndex))]
        }));
      }
    }
  }

  //
  // --------------------- Schema Names ---------------------
  //

  function getFullModuleName(stepIndex: number, exportName: string) {
    let finalStepIndex = stepIndex + 1;
    return stepBaseName + finalStepIndex + "_" + exportName;
  }
  function getModuleExportNames(stepIndex: number, moduleExportValues: {name: string, type: StringConstructor | NumberConstructor}[]):
    {name: string, type: StringConstructor | NumberConstructor}[]
  {
    return moduleExportValues.map(value => {
      return { name: getFullModuleName(stepIndex, value.name), type: value.type };
    })
  }
  function getExportResourceName(resource: UserResourceClickResult): string {
    if(resource.isSessionResource) {
      return getSessionResourceName(resource.resourceNumber);
    }
    else if(resource.resourceSubNumber == null) {
      return getGeneralResourceName(resource.resourceNumber);
    }
    else {
      return getGeneralResourceName(resource.resourceNumber, resource.resourceSubNumber);
    }
  }
  function getSessionResourceName(index: number): string {
    let basename = sessionResourceBaseName;
    let num1 = index + 1;
    return basename + num1;
  }
  function getGeneralResourceName(index1: number, index2: number | undefined = undefined): string {
    let basename = generalResourceBaseName;
    let num1 = index1 + 1;
    if(index2 == undefined) {
      return basename + num1;
    }
    let num2 = index2 + 1;
    return basename + num1 + "_" + num2;
  }
}