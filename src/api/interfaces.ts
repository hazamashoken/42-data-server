export interface Team {
  id: number;
  name: string;
  url: string;
  final_mark: null;
  project_id: number;
  created_at: Date;
  updated_at: Date;
  status: string;
  terminating_at: null;
  users: User[];
  "locked?": boolean;
  "validated?": null;
  "closed?": boolean;
  repo_url: string;
  repo_uuid: string;
  locked_at: Date;
  closed_at: Date;
  project_session_id: number;
  project_gitlab_path: string;
  scale_teams: ScaleTeam[];
  teams_uploads: any[];
}

export interface ScaleTeam {
  id: number;
  scale_id: number;
  comment: null;
  created_at: Date;
  updated_at: Date;
  feedback: null;
  final_mark: null;
  flag: Flag;
  begin_at: Date;
  correcteds: Correct[];
  corrector: Correct;
  truant: Truant;
  filled_at: null;
  questions_with_answers: any[];
}

export interface Correct {
  id: number;
  login: string;
  url: string;
}

export interface Flag {
  id: number;
  name: string;
  positive: boolean;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

export interface Truant {}

export interface User {
  id: number;
  login: string;
  url: string;
  leader: boolean;
  occurrence: number;
  validated: boolean;
  projects_user_id: number;
}
