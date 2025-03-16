'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

interface ProgressModalProps {
  isOpen: boolean
  title: string
  current: number
  total: number
  successCount: number
  errorCount: number
}

export function ProgressModal({ isOpen, title, current, total, successCount, errorCount }: ProgressModalProps) {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            Processing: {current} of {total}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Success: {successCount}</span>
            <span className="text-red-600">Errors: {errorCount}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 