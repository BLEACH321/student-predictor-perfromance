export interface Subject {
  name: string;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  grade: '10' | '11' | '12' | 'Engineering';
  studyHours: number;
  attendance: number;
  assignmentScore: number;
  previousMarks: number;
  subjects: Subject[];
  predictedMarks?: number;
}

export interface StudentData {
  studyHours: number;
  attendance: number;
  assignmentScore: number;
  previousMarks: number;
}
