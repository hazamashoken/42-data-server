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
  project_id: z.number().nullable(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  locked_at: z.string().nullable(),
  closed_at: z.string().nullable(),
  final_mark: z.string().nullable(),
  repo_url: z.string().nullable(),
  repo_uuid: z.string().nullable(),
  deadline_at: z.string().nullable(),
  terminating_at: z.string().nullable(),
  project_session_id: z.number().nullable(),
  status: z.string().nullable(),
});

const flagSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  positive: z.boolean().nullable(),
  icon: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

const scaleSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  comment: z.string().nullable(),
  introduction_md: z.string().nullable(),
  disclaimer_md: z.string().nullable(),
  guidelines_md: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  evaluation_id: z.number().nullable(),
  is_primary: z.boolean().nullable(),
  correction_number: z.number().nullable(),
  duration: z.number().nullable(),
  manual_subscription: z.boolean().nullable(),
  is_external: z.boolean().nullable(),
  free: z.boolean().nullable(),
});

const project = z.object({
  id: z.number(),
  name: z.string().nullable(),
  slug: z.string().nullable(),
});

const image = z.object({
  link: z.string().nullable(),
  versions: z.object({
    large: z.string().nullable(),
    medium: z.string().nullable(),
    small: z.string().nullable(),
    micro: z.string().nullable(),
  }),
});

const user = z.object({
  id: z.number(),
  email: z.string().nullable(),
  login: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  usual_first_name: z.string().nullable(),
  url: z.string().nullable(),
  phone: z.string().nullable(),
  displayname: z.string().nullable(),
  image: image,
  "staff?": z.boolean().nullable(),
  correction_point: z.number().nullable(),
  pool_month: z.string().nullable(),
  pool_year: z.string().nullable(),
  location: z.string().nullable(),
  wallet: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export const createScaleTeamSchema = z.object({
  body: z.object({
    id: z.number(),
    team: teamSchema,
    truant: z.string().nullable(),
    flag: flagSchema,
    scale: scaleSchema,
    begin_at: z.string(),
    comment: z.string().nullable(),
    old_feedback: z.string().nullable(),
    feedback_rating: z.string().nullable(),
    final_mark: z.string().nullable(),
    token: z.string().nullable(),
    ip: z.string().nullable(),
    filled_at: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
    project: project,
    user: user,
  }),
});

export type ScaleTeamCreate = z.infer<typeof createScaleTeamSchema>;
