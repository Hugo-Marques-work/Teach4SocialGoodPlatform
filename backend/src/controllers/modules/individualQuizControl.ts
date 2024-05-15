import { ModuleControls } from "./moduleControls";

import { Request, Response } from "express-serve-static-core";
import { IndividualSessionQuiz } from "@/models/IndividualSessionQuiz.model";
import { IndividualSessionQuizQuestionDto } from "@/models/dto/IndividualSessionQuizQuestionDto.model";
import { IndividualSessionQuizQuestion } from "@/models/IndividualSessionQuizQuestion.model";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { UserModuleResult } from "@/models/result/userModuleResult.model";

export class ModuleControlIndividualQuiz extends ModuleControls<IndividualSessionQuiz> {
  readonly moduleName: string = 'IndividualSessionQuiz';
  readonly moduleTypeName: string = 'IndividualSessionQuiz';
  readonly stringName: string = 'Quiz Individual';

  constructor() {
    super();
  }
  
  //new methods
  
  async createSimpleModule(orderedModule: SessionOrderedModule) {
    return await IndividualSessionQuiz.create({
      sessionOrderedModuleId: orderedModule.id
    });
  }

  //overriden
  override async getFormattedFromModule(individualSessionQuiz: IndividualSessionQuiz): Promise<IndividualSessionQuizQuestionDto[]> {
    let quizQuestions = await individualSessionQuiz.$get("individualSessionQuizQuestions")
    let resQuestions = [] as IndividualSessionQuizQuestionDto[];
    for(let qQuestion of quizQuestions) {
      resQuestions.push(
        new IndividualSessionQuizQuestionDto(qQuestion)
      )
    }
    return resQuestions;
  }

  override async getFromOrderedModule(oModule: SessionOrderedModule): Promise<IndividualSessionQuiz | null> {
    return await oModule.$get('individualSessionQuiz');
  }

  override async getFromModuleType(req: Request, res: Response, individualSessionQuiz: IndividualSessionQuiz) {
    let resModule = await this.getFormattedFromModule(individualSessionQuiz);
    res.send(resModule);
  }

  override async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<IndividualSessionQuiz> {
    return await this.createSimpleModule(orderedModule);
  }

  override async destroySubElements(individualSessionQuiz: IndividualSessionQuiz): Promise<void> {
    let quizQuestions = await individualSessionQuiz.$get("individualSessionQuizQuestions")
    for(let qQuestion of quizQuestions) {
      await qQuestion.destroy();
    }
  }

  override async createSubElements(individualSessionQuiz: IndividualSessionQuiz, req: any): Promise<void> {
    let questions = req.body.questions;

    for(let index in questions) {
      let qQuestion = questions[index];
      await IndividualSessionQuizQuestion.create({
        //order: index,
        question: qQuestion.question,
        feedback: qQuestion.feedback,
        correctAnswer: qQuestion.correctAnswer,
        individualSessionQuizId: individualSessionQuiz.id
      });
    }
  }

  override async destroySelf(module: IndividualSessionQuiz): Promise<void> {
    await module.destroy();
  }

  override async copyModule(newModule: SessionOrderedModule, oldIndividualQuiz: IndividualSessionQuiz) {
    let newIndividualQuiz = await this.createSimpleModule(newModule);
  
    let quizQuestions = await oldIndividualQuiz.$get('individualSessionQuizQuestions');
    //await this.createSubElements(newIndividualQuiz, quizQuestions);
    for(let quizQuestion of quizQuestions) {
      //repeated but worth staying
      await IndividualSessionQuizQuestion.create({
        question: quizQuestion.question,
        feedback: quizQuestion.feedback,
        correctAnswer: quizQuestion.correctAnswer,
        individualSessionQuizId: newIndividualQuiz.id
      });
    }
  }

  //missing putstatic
  //result related

  getExportName(index: number): string {
    const individualQuizBaseName = 'Quiz_Individual_';    
    let num = index + 1;
    return individualQuizBaseName + num;

  }
  async getExportValues(individualSessionQuiz: IndividualSessionQuiz): 
    Promise<{name: string, type: StringConstructor | NumberConstructor}[]>
  {
    let quizQuestions = await individualSessionQuiz.$get('individualSessionQuizQuestions');
    let res = [] as {name: string, type: StringConstructor | NumberConstructor}[];
    for(let index in quizQuestions) {
      res.push({name: this.getExportName(parseInt(index)), type: String});
    }
    return res;
  }

  async getResults(moduleResult: UserModuleResult): Promise<{name: string, result: string}[]> {
    let individualQuizResults = await moduleResult.$get('userIndividualQuizResults', {
      order: [['questionNumber', 'ASC']]
    });
    let res = [] as { name: string, result: string }[];

    for(let index in individualQuizResults) {
      //if possible change answer in the table to boolean
      res.push({name: this.getExportName(parseInt(index)), result: (individualQuizResults[index].answer == "1") ? 'Correto' : 'Errado'})
    }
    return res;
  }
}