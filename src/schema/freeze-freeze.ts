import { z } from 'zod';

export interface FreezeFreezeWH {
  user_id:             number;
  login:               string;
  status:              string;
  begin_date:          Date;
  expected_end_date:   Date;
  effective_end_date:  null;
  reason:              string;
  category:            string;
  is_free_freeze:      boolean;
  student_description: string;
  staff_description:   string;
  approved_by:         string;
  approved_at:         Date;
}

export const freezeFreezeSchema = z.object({
  body: z.object({
    user_id: z.string(),
    login: z.string(),
    status: z.string(),
    begin_date: z.string().nullable(),
    expected_end_date: z.string().nullable(),
    effective_end_date: z.string().nullable(),
    reason: z.string().nullable(),
    category: z.string().nullable(),
    is_free_freeze: z.boolean().nullable(),
    student_description: z.string().nullable(),
    staff_description: z.string().nullable(),
    approved_by: z.string().nullable(),
    approved_at: z.string().nullable(),

  })
})

export type FreezeFreeze = z.infer<typeof freezeFreezeSchema>;