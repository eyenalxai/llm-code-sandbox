import { cn } from '@/lib/utils'
import { Editor } from '@/components/editor'

export default function Home() {
  return (
    <main className={cn('max-w-3xl', 'w-full')}>
      <Editor />
    </main>
  )
}
