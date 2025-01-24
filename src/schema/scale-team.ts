import { z } from "zod";

export interface ScaleTeam {
  id: number;
  team: Team;
  truant: null;
  flag: Flag;
  scale: Scale;
  begin_at: string;
  comment: null;
  old_feedback: null;
  feedback_rating: null;
  final_mark: null;
  token: null;
  ip: null;
  filled_at: null;
  created_at: string;
  updated_at: string;
  project: Project;
  user: User;
}

interface Flag {
  id: number;
  name: string;
  positive: boolean;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  slug: string;
}

interface Scale {
  id: number;
  name: string;
  comment: string;
  introduction_md: string;
  disclaimer_md: string;
  guidelines_md: string;
  created_at: string;
  updated_at: string;
  evaluation_id: number;
  is_primary: boolean;
  correction_number: number;
  duration: number;
  manual_subscription: boolean;
  is_external: boolean;
  free: boolean;
}

interface Team {
  id: number;
  project_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  locked_at: string;
  closed_at: string;
  final_mark: null;
  repo_url: string;
  repo_uuid: string;
  deadline_at: null;
  terminating_at: null;
  project_session_id: number;
  status: string;
}

interface User {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_first_name: null;
  url: string;
  phone: string;
  displayname: string;
  image: Image;
  "staff?": boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: null;
  wallet: number;
  created_at: string;
  updated_at: string;
}

interface Image {
  link: string;
  versions: Versions;
}

interface Versions {
  large: string;
  medium: string;
  small: string;
  micro: string;
}

const teamSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  locked_at: z.string(),
  closed_at: z.string(),
  final_mark: z.null(),
  repo_url: z.string(),
  repo_uuid: z.string(),
  deadline_at: z.null(),
  terminating_at: z.null(),
  project_session_id: z.number(),
  status: z.string(),
});

const flagSchema = z.object({
  id: z.number(),
  name: z.string(),
  positive: z.boolean(),
  icon: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const scaleSchema = z.object({
  id: z.number(),
  name: z.string(),
  comment: z.string(),
  introduction_md: z.string(),
  disclaimer_md: z.string(),
  guidelines_md: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  evaluation_id: z.number(),
  is_primary: z.boolean(),
  correction_number: z.number(),
  duration: z.number(),
  manual_subscription: z.boolean(),
  is_external: z.boolean(),
  free: z.boolean(),
});

const project = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

const image = z.object({
  link: z.string(),
  versions: z.object({
    large: z.string(),
    medium: z.string(),
    small: z.string(),
    micro: z.string(),
  }),
});

const user = z.object({
  id: z.number(),
  email: z.string(),
  login: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  usual_first_name: z.null(),
  url: z.string(),
  phone: z.string(),
  displayname: z.string(),
  image: image,
  "staff?": z.boolean(),
  correction_point: z.number(),
  pool_month: z.string(),
  pool_year: z.string(),
  location: z.null(),
  wallet: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createScaleTeamSchema = z.object({
  body: z.object({
    id: z.number(),
    team: teamSchema,
    truant: z.null(),
    flag: flagSchema,
    scale: scaleSchema,
    begin_at: z.string(),
    comment: z.null(),
    old_feedback: z.null(),
    feedback_rating: z.null(),
    final_mark: z.null(),
    token: z.null(),
    ip: z.null(),
    filled_at: z.null(),
    created_at: z.string(),
    updated_at: z.string(),
    project: project,
    user: user,
  }),
});

export type ScaleTeamCreate = z.infer<typeof createScaleTeamSchema>;
