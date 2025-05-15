import { z } from 'zod';

export const createSogoinfreSchema = z.object({
  body: z.array(z.object({
    name: z.string(),
    size: z.number(),
  }))
})

export type SgoinfreSizeCreate = z.infer<typeof createSogoinfreSchema>;