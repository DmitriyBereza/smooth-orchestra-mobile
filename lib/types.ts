export interface LoginResponse {
  token: string;
  expiresAt: string;
  userId: string;
}

export interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  pipelineType?: 'development' | 'marketing' | 'design';
}

export interface SessionState {
  id: string;
  task: TaskDefinition;
  currentStage: string;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  projectName?: string;
  pipelineType?: string;
  qaDecision?: 'approved' | 'rejected' | null;
}

export interface ArtifactMeta {
  type: string;
  taskId: string;
  filename: string;
  createdAt: string;
  stage: string;
}

export interface ArtifactContent {
  taskId: string;
  type: string;
  content: string;
}
