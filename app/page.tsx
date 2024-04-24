import { cn } from '@/lib/utils'
import { z } from 'zod'
import { Editor } from '@/components/editor'

const FormSchema = z.object({
  code: z
    .string()
    .min(8, {
      message: 'CODE MUST BE AT LEAST 8 CHARACTERS'
    })
    .max(4096, {
      message: 'CODE MUST BE LESS THAN 4096 CHARACTERS'
    })
})

export default function Home() {
  return (
    <main className={cn('max-w-3xl', 'w-full')}>
      <Editor />
    </main>
  )
}
