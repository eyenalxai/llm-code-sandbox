import OpenAI from 'openai'
import { env } from '@/lib/env'

export const openai = new OpenAI({
  apiKey: env.OPEN_AI_API_KEY
})
