export class UpdatedQuestion {
   public questionId: number;
   public question: string;
   public isImageAvailable: boolean;
   public imageUrl: string;
   public questionType: string;
   public topicName: string;
   public difficultyLevel: string;
   public maximumMarks: number;
   public timeToSolve: number;
   public isOptionAvailable: boolean;
   public subjectInformation: number;
   public classInformation: number;
   public boardInformation: number;
   public ccInformation: number;
   public options: any[] = []
}


