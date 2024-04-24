import { z } from 'zod'

export const isValidCodeSchema = z.object({
  isValidCode: z.boolean()
})
