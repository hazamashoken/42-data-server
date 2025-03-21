import { z } from 'zod';

export interface PaceUserWH {
  user_id:                number;
  cursus_begin_date:      Date;
  matrix_version:         number;
  campus_id:              number;
  pace:                   number;
  milestone:              number;
  deadline:               Date;
  cumulative_freeze_days: number;
  is_activated:           boolean;
  activated_at:           Date;
  allow_speed_up:         boolean;
}

export const paceUserSchema = z.object({
  body: z.object({
    user_id:                z.number(),
    cursus_begin_date:      z.string().nullable(),
    matrix_version:         z.number().nullable(),
    campus_id:              z.number().nullable(),
    pace:                   z.number().nullable(),
    milestone:              z.number().nullable(),
    deadline:               z.string().nullable(),
    cumulative_freeze_days: z.number().nullable(),
    is_activated:           z.boolean().nullable(),
    activated_at:           z.string().nullable(),
    allow_speed_up:         z.boolean().nullable(),
  })
})

export type PaceUser = z.infer<typeof paceUserSchema>;
