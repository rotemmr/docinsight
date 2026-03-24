import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface UploadSidebarProps {
  totalChunks: number;
  onIngested: (chunks: number, files: { name: string; chunks: number }[]) => void;
}

export interface UploadedFile {
  name: string;
  chunks: number;
}

const UploadSidebar = ({ totalChunks, onIngested }: UploadSidebarProps) => {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (fileList: FileList | File[]) => {
    if (!fileList.length) return;
    setStatus("uploading");

    const formData = new FormData();
    Array.from(fileList).forEach((f) => formData.append("files", f));

    try { 
      const res = await fetch("http://localhost:8000/ingest", { method: "POST", body: formData });
      const data = await res.json();
      const chunks = data.ingested?.reduce((sum: number, f: any) => sum + (f.chunks_ingested ?? 0), 0) ?? 0;
      const newFiles = data.ingested?.map((f: any) => ({ name: f.doc_id, chunks: f.chunks_ingested ?? 0 })) ?? [];
      setFiles((prev) => [...prev, ...newFiles]);
      setStatus("done");
      onIngested(chunks, newFiles);
    } catch {
      setStatus("error");
    }
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">DocInsight</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Document search assistant</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="px-5 pt-4 pb-2">
        <h2 className="text-[11px] font-medium uppercase tracking-widest text-sidebar-heading">Documents</h2>
      </div>

      {/* Drop zone */}
      <div className="px-4 pb-3">
        <div
          className={`group cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
            dragOver
              ? "border-ring bg-accent"
              : "border-border hover:border-ring/50 hover:bg-accent/50"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2 text-center">
            {status === "uploading" ? (
              <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground/70" />
            )}
            <p className="text-xs text-muted-foreground">
              {status === "uploading" ? "Uploading..." : "Drop files or click to upload"}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      {totalChunks > 0 && (
        <div className="mx-4 mb-3 rounded-md bg-accent/50 px-3 py-2 animate-fade-in">
          <p className="text-[11px] text-muted-foreground">{totalChunks} chunks indexed</p>
        </div>
      )}

      {status === "error" && (
        <div className="mx-4 mb-3 rounded-md bg-destructive/10 px-3 py-2 animate-fade-in">
          <p className="text-[11px] text-destructive">Upload failed. Try again.</p>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto px-4 space-y-0.5">
        {files.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground animate-slide-in"
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <span className="block truncate">{f.name}</span>
              <span className="text-[10px] text-muted-foreground">{f.chunks} chunks</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default UploadSidebar;
