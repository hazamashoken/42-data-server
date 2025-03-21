import { z } from 'zod';


export interface FreezeUserWH {
  user_id:                 number;
  login:                   string;
  available_bonus_days:    number;
  used_freeze_days:        number;
  total_freeze_occurences: number;
  is_freeze:               boolean;
  is_activated:            boolean;
  cursus_begin_date:       Date;
}

export const freezeUserSchema = z.object({
  body: z.object({
    user_id:                 z.number(),
    login:                   z.string().nullable(),
    available_bonus_days:    z.number().nullable(),
    used_freeze_days:        z.number().nullable(),
    total_freeze_occurences: z.number().nullable(),
    is_freeze:               z.boolean().nullable(),
    is_activated:            z.boolean().nullable(),
    cursus_begin_date:       z.string().nullable(),
  })
})

export type FreezeUser = z.infer<typeof freezeUserSchema>;