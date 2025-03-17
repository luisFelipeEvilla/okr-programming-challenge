"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/services/constantContact.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Clock
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { Task } from "@/schemas/Task";
import { Badge } from "@/components/ui/badge";
import TasksTable from "@/components/Tables/TasksTable/TasksTable";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        const response = await getTasks();
        setTasks(response.activities);
      } catch (error) {
        toast.error("Failed to fetch tasks");
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const handleDownload = async (taskId: string) => {
    try {
      setIsDownloading(taskId);
      // remove the v3 from the url and get only the path
      const response = await axios.get(`/api?id=${taskId}`);

      console.log(response.data);
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `task-${taskId}-results.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download results");
      console.error("Error downloading results:", error);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Tasks</CardTitle>
                <CardDescription className="mt-2">
                  View and manage your import and export tasks
                </CardDescription>
              </div>
              <Badge variant="secondary" className="h-8 px-4 text-sm">
                {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <TasksTable
              tasks={tasks}
              isDownloading={isDownloading}
              handleDownload={handleDownload}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NoTasksMessage() {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
      <div className="flex flex-col items-center gap-2 text-center">
        <Clock className="h-10 w-10 text-muted-foreground" />
        <h3 className="font-semibold">No tasks found</h3>
        <p className="text-sm text-muted-foreground">
          Tasks will appear here when you import or export contacts
        </p>
      </div>
    </div>
  );
}
