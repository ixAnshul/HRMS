interface Tasks {
    id: string;
    title: string;
    comments: string;
    employee: string;
    assignDate : Date | null
    dueDate: Date | null;
  }
export default Tasks;