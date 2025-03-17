import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Task } from "@/schemas/Task";
import TaskErrorDialog from "@/components/Dialogs/TaskErrorDialog";

const STATUS_ICONS = {
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  cancelled: <XCircle className="h-4 w-4 text-gray-500" />,
  timed_out: <AlertCircle className="h-4 w-4 text-orange-500" />,
} as const;

const STATUS_STYLES = {
  completed: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  cancelled: "bg-gray-50 text-gray-700 border-gray-200",
  timed_out: "bg-orange-50 text-orange-700 border-orange-200",
} as const;

export default function TasksTable({
  tasks,
  isDownloading,
  handleDownload,
  isLoading,
}: {
  tasks: Task[];
  isDownloading: string | null;
  handleDownload: (id: string) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin" color="blue"/>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Task ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.activity_id} className="group">
              <TableCell className="font-mono text-xs">
                {task.activity_id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {STATUS_ICONS[task.state]}
                  <Badge
                    variant="secondary"
                    className={`${STATUS_STYLES[task.state]} border`}
                  >
                    {task.state.toUpperCase()}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="w-[200px]">
                <div className="flex flex-col gap-2">
                  <Progress value={task.percent_done} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {task.percent_done}% Complete
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(task.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {task.completed_at ? (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {new Date(task.completed_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.completed_at).toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {task.activity_errors.length > 0 ? (
                  <TaskErrorDialog task={task} />
                ) : (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {task.status.items_completed_count} /{" "}
                      {task.status.items_total_count}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      items processed
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                {task._links.results?.href && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(task.activity_id)}
                    disabled={isDownloading === task.activity_id}
                    className="gap-2 transition-all group-hover:border-primary"
                  >
                    <Download
                      className={`h-4 w-4 ${
                        isDownloading === task.activity_id
                          ? "animate-pulse"
                          : ""
                      }`}
                    />
                    {isDownloading === task.activity_id
                      ? "Downloading..."
                      : "Download"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
