import { Check, File} from "lucide-react";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
export default function FilesPreview({ selectedFile }: { selectedFile: File }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
        <File className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-medium">{selectedFile.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(selectedFile.size)}
        </p>
      </div>
      <Check className="ml-auto h-5 w-5 text-green-500" />
    </div>
  );
}
