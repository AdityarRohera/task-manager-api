

// New Task type
export interface NewTaskType {
  title: string;
  desc: string;
  priorty : 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId : string;
  userId: string;
}