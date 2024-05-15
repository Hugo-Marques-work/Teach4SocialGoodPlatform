import { IndividualSessionQuizQuestion } from "@/models/IndividualSessionQuizQuestion.model";

export class IndividualSessionQuizQuestionDto {
    question: string = '';
    feedback: string = '';
    correctAnswer: boolean = false;

    constructor(question: IndividualSessionQuizQuestion) {
        this.question = question.question;
        this.feedback = question.feedback;
        this.correctAnswer = question.correctAnswer;
    }
}