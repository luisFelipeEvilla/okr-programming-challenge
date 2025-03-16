'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface ProgressModalProps {
  isOpen: boolean
  progress: number
  total: number
  title?: string
  description?: string
  onCancel?: () => void
  isCanceling?: boolean
}

export function ProgressModal({
  isOpen,
  progress,
  total,
  title = "Uploading Contacts",
  description = "Please wait while your contacts are being uploaded...",
  onCancel,
  isCanceling = false,
}: ProgressModalProps) {
  const percentage = Math.round((progress / total) * 100)

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Progress value={percentage} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {progress} of {total} contacts processed ({percentage}%)
          </p>
        </div>
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={onCancel}
            disabled={isCanceling}
          >
            {isCanceling ? "Canceling..." : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 