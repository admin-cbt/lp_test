import { plainToClass } from "class-transformer";

export class QuestionSet {
    public questionId: number;
    public setName: string;
    public paperTime: number;
    public totalMark: number;
    public subjectInformation: number;
    public classInformation: number;
    public boardInformation: number;
    public ccInformation: number;
    public questions: Question[] = [];

    set que(questions: any[]) {
        questions.forEach(q => {
            this.questions.push(plainToClass(Question, q))
        });

    }

    get que() {
        return this.questions;
    }

    getModel() {
        const o = this;
        o.questions = o.questions.map(x => x.getQuestions())
        return o;
    }
}

export class Option {
    optionName: string;
    isCorrectAnswer: boolean;
    optionId: number;
}

export class SubjectInfo {
    subjectName: string;
    subjectId: number;
}

export class ClassInfo {
    className: string;
    classId: number;
}

export class BoardInfo {
    boardId: number;
    boardName: string;
}

export class Question {
    question: string;
    isImageAvailable: boolean;
    questionType: string;
    difficultyLevel: string;
    maximumMarks: number;
    timeToSolve: number;
    isOptionAvailable: boolean;
    questionId: number;
    options: Option[];
    subjectInfo: SubjectInfo;
    classInfo: ClassInfo;
    boardInfo: BoardInfo;
    isChecked: boolean = false;

    getQuestions() {
        const o = JSON.parse(JSON.stringify(this));
        delete o.isChecked;
        return o;
    }
}

