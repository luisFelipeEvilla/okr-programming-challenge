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
import { Badge } from "@/components/ui/badge"

interface ProgressModalProps {
  isOpen: boolean
  progress: number
  total: number
  successCount: number
  failureCount: number
  title?: string
  description?: string
  onCancel?: () => void
  isCanceling?: boolean
}

export function ProgressModal({
  isOpen,
  progress,
  total,
  successCount,
  failureCount,
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
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              {progress} of {total} contacts processed ({percentage}%)
            </p>
            <div className="flex justify-center gap-3">
              <Badge variant="success" className="text-xs">
                {successCount} Successful
              </Badge>
              {failureCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {failureCount} Failed
                </Badge>
              )}
            </div>
          </div>
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