import { ModuleControls } from "./moduleControls";

import { Request, Response } from "express-serve-static-core";
import { EvaluationQuiz } from "@/models/evaluationQuiz/EvaluationQuiz.model";
import { EvaluationQuizQuestion } from "@/models/evaluationQuiz/EvaluationQuizQuestion.model";
import { EvaluationQuizMultipleAnswer } from "@/models/evaluationQuiz/EvaluationQuizMultipleAnswer.model";
import { EvaluationQuizMultiRadio } from "@/models/evaluationQuiz/EvaluationQuizMultiRadio.model";
import { EvaluationQuizMultiRadioQuestion } from "@/models/evaluationQuiz/EvaluationQuizMultiRadioQuestion.model";
import { EvaluationQuizSingleRadio } from "@/models/evaluationQuiz/EvaluationQuizSingleRadio.model";
import { EvaluationQuizOrder } from "@/models/evaluationQuiz/EvaluationQuizOrder.model";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { UserModuleResult } from "@/models/result/userModuleResult.model";

export class ModuleControlEvaluationQuiz extends ModuleControls<EvaluationQuiz> {
  readonly moduleName: string = 'EvaluationQuiz';
  readonly moduleTypeName: string = 'EvaluationSessionQuiz';
  readonly stringName: string = 'Quiz de Avaliação';

  constructor() {
    super();
  }
  
  //new methods
  async getFormattedFromModule(evaluationQuiz: EvaluationQuiz): Promise<any[]> {
    let orderQuizzes = await evaluationQuiz.$get("evaluationQuizOrders")
    let response = new Array(orderQuizzes.length) as any[];
    for(let orderQuiz of orderQuizzes) {
      let quest = await orderQuiz.$get('evaluationQuizQuestion');
      if(quest) {
        response[orderQuiz.order] = {
          component: 0,
          question: quest.question
        }
        continue;
      }
      let multiRadio = await orderQuiz.$get('evaluationQuizMultiRadio');
      if(multiRadio) {
        let pushObject = {
          component: 1,
          mainQuestion: multiRadio.mainQuestion,
          nOptions: multiRadio.nOptions,
          radioQuestions: [] as string[]
        };
        let multiQuestions = await multiRadio.$get('evaluationQuizMultiRadioQuestions');
        for(let mQuestion of multiQuestions) {
          pushObject.radioQuestions.push(mQuestion.question);
        }
        response[orderQuiz.order] = pushObject;
        continue;
      }
      let multiAnswer = await orderQuiz.$get('evaluationQuizMultipleAnswer');
      if(multiAnswer) {
        response[orderQuiz.order] = {
          component: 2,
          question: multiAnswer.question,
          nAnswers: multiAnswer.nAnswers
        }
        continue;
      }
      let singleRadio = await orderQuiz.$get('evaluationQuizSingleRadio');
      if(singleRadio) {
        response[orderQuiz.order] = {
          component: 3,
          question: singleRadio.question,
          nOptions: singleRadio.nOptions
        }
        continue;
      }
    }

    return response;
  }

  async createSimpleModule(orderedModule: SessionOrderedModule): Promise<EvaluationQuiz> {
    return await EvaluationQuiz.create({
      sessionOrderedModuleId: orderedModule.id
    });
  }
  //overriden

  override async getFromOrderedModule(oModule: SessionOrderedModule): Promise<EvaluationQuiz | null> {
    return await oModule.$get('evaluationQuiz');
  }

  override async getFromModuleType(req: Request, res: Response, evaluationQuiz: EvaluationQuiz) {
    let resModule = await this.getFormattedFromModule(evaluationQuiz);
    res.send(resModule);
  }

  override async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<EvaluationQuiz> {
    return await this.createSimpleModule(orderedModule);
  }

  override async destroySubElements(evaluationQuiz: EvaluationQuiz): Promise<void> {

    let orderQuizzes = await evaluationQuiz.$get("evaluationQuizOrders");

    for(let index in orderQuizzes) {
      let orderQuiz = orderQuizzes[index];
  
      let quest = await orderQuiz.$get('evaluationQuizQuestion');
      let multiAnswer = await orderQuiz.$get('evaluationQuizMultipleAnswer');
      let singleRadio = await orderQuiz.$get('evaluationQuizSingleRadio');
      let multiRadio = await orderQuiz.$get('evaluationQuizMultiRadio');

      if(quest) { await quest.destroy(); }
      if(multiAnswer) { await multiAnswer.destroy(); }
      if(singleRadio) { await singleRadio.destroy(); }
      if(multiRadio) {
        let multiQuestions = await multiRadio.$get('evaluationQuizMultiRadioQuestions');
        for(let mQuestion of multiQuestions) {
          await mQuestion.destroy();
        }
        await multiRadio.destroy();
      }
  
      await orderQuiz.destroy();
    }
  }

  override async createSubElements(evaluationQuiz: EvaluationQuiz, req: any): Promise<void> {
    let questions = req.body.questions;
  
    for(let index in questions) {
      let orderQuiz = await EvaluationQuizOrder.create({
        order: index,
        evaluationQuizId: evaluationQuiz.id,
      });
  
      let quest = questions[index];
      if(quest.component == 'FormQuestion') {
        await EvaluationQuizQuestion.create({
          evaluationQuizOrderId: orderQuiz.id,
          question: quest.question
        });
        continue;
      }
      if(quest.component == 'FormMultiRadio') {
        let evaluationQuizMultiRadio = await EvaluationQuizMultiRadio.create({
          evaluationQuizOrderId: orderQuiz.id,
          mainQuestion: quest.mainQuestion,
          nOptions: quest.nOptions
        });
  
        for(let subQuestion of quest.radioQuestions) {
          await EvaluationQuizMultiRadioQuestion.create({
            evaluationQuizMultiRadioId: evaluationQuizMultiRadio.id,
            question: subQuestion
          });
        }
        continue;
      }
      if(quest.component == 'FormMultipleAnswer') {
        await EvaluationQuizMultipleAnswer.create({
          evaluationQuizOrderId: orderQuiz.id,
          question: quest.question,
          nAnswers: quest.nAnswers
        });
        continue;
      }
      if(quest.component == 'FormSingleRadio') {
        await EvaluationQuizSingleRadio.create({
          evaluationQuizOrderId: orderQuiz.id,
          question: quest.question,
          nOptions: quest.nOptions
        });
        continue;
      }
    }
  }

  override async destroySelf(module: EvaluationQuiz): Promise<void> {
    await module.destroy();
  }

  override async copyModule(newModule: SessionOrderedModule, oldEvaluationQuiz: EvaluationQuiz) {
    let newEvaluationQuiz = await this.createSimpleModule(newModule);
  
    let evaluationQuizOrders = await oldEvaluationQuiz.$get('evaluationQuizOrders');
    for(let quizOrder of evaluationQuizOrders) {
      let newQuizOrder = await EvaluationQuizOrder.create({
        order: quizOrder.order,
        evaluationQuizId: newEvaluationQuiz.id
      });
  
      let quizQuestion = await quizOrder.$get('evaluationQuizQuestion');
      let quizMultiRadio = await quizOrder.$get('evaluationQuizMultiRadio');
      let quizMultipleAnswer = await quizOrder.$get('evaluationQuizMultipleAnswer');
      let quizSingleRadio = await quizOrder.$get('evaluationQuizSingleRadio');
  
      if(quizQuestion) {
        await EvaluationQuizQuestion.create({
          evaluationQuizOrderId: newQuizOrder.id,
          question: quizQuestion.question
        });
        continue;
      }
      if(quizMultiRadio) {
        let newQuizMultiRadio = await EvaluationQuizMultiRadio.create({
          evaluationQuizOrderId: newQuizOrder.id,
          mainQuestion: quizMultiRadio.mainQuestion,
          nOptions: quizMultiRadio.nOptions
        });
  
        let radioQuestions = await quizMultiRadio.$get('evaluationQuizMultiRadioQuestions');
        for(let subQuestion of radioQuestions) {
          await EvaluationQuizMultiRadioQuestion.create({
            evaluationQuizMultiRadioId: newQuizMultiRadio.id,
            question: subQuestion.question
          });
        }
        continue;
      }
      if(quizMultipleAnswer) {
        await EvaluationQuizMultipleAnswer.create({
          evaluationQuizOrderId: newQuizOrder.id,
          question: quizMultipleAnswer.question,
          nAnswers: quizMultipleAnswer.nAnswers
        });
        continue;
      }
      if(quizSingleRadio) {
        await EvaluationQuizSingleRadio.create({
          evaluationQuizOrderId: newQuizOrder.id,
          question: quizSingleRadio.question,
          nOptions: quizSingleRadio.nOptions
        });
        continue;
      }
    }
  }

  //missing putstatic

  getExportName(index1: number, index2: number | undefined = undefined): string {
    const baseName = 'Quiz_Avaliação_';    
    let num1 = index1 + 1;
    if(index2 == undefined) {
      return baseName + num1;
    }
    let num2 = index2 + 1;
    return baseName + num1 + "_" + num2;

  }
  async getExportValues(evaluationQuiz: EvaluationQuiz): 
    Promise<{name: string, type: StringConstructor | NumberConstructor}[]>
  {
    let quizOrders = await evaluationQuiz.$get('evaluationQuizOrders');
    let singlePushArray = new Array(quizOrders.length);
    let multiPushArray = new Array(quizOrders.length);
    for(let quizOrder of quizOrders) {
      let order = quizOrder.order;
      let questionQuestion = await quizOrder.$get('evaluationQuizQuestion');
      let multiRadioQuestion = await quizOrder.$get('evaluationQuizMultiRadio');
      let multiAnswerQuestion = await quizOrder.$get('evaluationQuizMultipleAnswer');
      let singleRadioQuestion = await quizOrder.$get('evaluationQuizSingleRadio');

      if(questionQuestion || singleRadioQuestion) {
        singlePushArray[order] = {
          name: this.getExportName(order),
          type: String
        };
      }
      else if(multiRadioQuestion) {
        let miniArray = [];
        let length = (await multiRadioQuestion.$get('evaluationQuizMultiRadioQuestions')).length;
        for(let i = 0; i < length; i++) {
          miniArray.push({
            name: this.getExportName(order, i),
            type: String
          });
        }
        multiPushArray[order] = miniArray;
      }
      else if(multiAnswerQuestion) {
        let miniArray = [];
        for(let i = 0; i < multiAnswerQuestion.nAnswers; i++) {
          miniArray.push({
            name: this.getExportName(order, i),
            type: String
          });
        }
        multiPushArray[order] = miniArray;
      }
    }

    let finalArray = [];
    for(
      let singleIndex = 0; 
      singleIndex < singlePushArray.length; 
      singleIndex++
    ) {
      if(singlePushArray[singleIndex] == undefined) {
        finalArray.push(...multiPushArray[singleIndex])
      }
      else {
        finalArray.push(singlePushArray[singleIndex]);
      }
    }
    return finalArray;
  }

  async getResults(moduleResult: UserModuleResult): Promise<{name: string, result: string}[]> {
    let evaluationQuizResults = await moduleResult.$get('userEvaluationQuizResults', {
      order: [
        ['questionNumber', 'ASC'],
        ['questionSubNumber', 'ASC']
      ]
    });
    let res = [] as { name: string, result: string }[];

    for(let index in evaluationQuizResults) {
      let quiz = evaluationQuizResults[index];
      if(quiz.questionSubNumber == null) {
        res.push({name: this.getExportName(quiz.questionNumber), result: quiz.answer})
      }
      else {
        res.push({name: this.getExportName(quiz.questionNumber, quiz.questionSubNumber), result: quiz.answer})
      }
    }

    return res;
  }
}