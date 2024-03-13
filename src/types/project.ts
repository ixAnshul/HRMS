interface Projects {
    name: string;
    totalTasks: number | 0;
    pendingTasks: number | 0;
    completedTasks: number | 0;
    sprint: number | 0;
    createdAt : Date | null
    deathLine: Date | null;
  }
export default Projects;