export class Question {
    public subjectInformation: number = null;
    public classInformation: number = null;
    public boardInformation: number = null;
    public question: string
    public isImageAvailable: boolean
    public imageUrl: string
    public imagesIds: any[]
    public questionType: string
    public topicName: string
    public difficultyLevel: string
    public maximumMarks: number = null;
    public timeToSolve: number = null;
    public ccInformation: number = null;
    public isOptionAvailable: boolean
    public options: any[]
}