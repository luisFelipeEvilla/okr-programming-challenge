import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { AlertCircle } from "lucide-react";
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Task } from "@/schemas/Task";

interface TaskErrorDialogProps {
  task: Task;
}

export default function TaskErrorDialog({ task }: TaskErrorDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 text-left hover:bg-transparent"
        >
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span>
              {task.activity_errors.length} error
              {task.activity_errors.length > 1 ? "s" : ""}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            Task Errors
          </DialogTitle>
          <DialogDescription>
            The following errors occurred during task execution
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-4">
            {task.activity_errors.map((error, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-red-900">
                      Error {index + 1} of {task.activity_errors.length}
                    </p>
                    <p className="text-sm text-red-700 whitespace-pre-wrap">
                      {typeof error === "string"
                        ? error
                        : JSON.stringify(error, null, 2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
