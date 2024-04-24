import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

export const Editor = () => {
  return (
    <ResizablePanelGroup direction="vertical" className={cn('min-h-screen')}>
      <ResizablePanel>
        <Textarea
          placeholder="Enter your code here..."
          className={cn('min-h-full')}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}
