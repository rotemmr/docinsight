import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";

interface UploadSidebarProps {
  totalChunks: number;
  onIngested: (chunks: number) => void;
}

interface UploadedFile {
  name: string;
  chunks: number;
}

const UploadSidebar = ({ totalChunks, onIngested }: UploadSidebarProps) => {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (fileList: FileList | File[]) => {
    if (!fileList.length) return;
    setStatus("uploading");
    setMessage(`מעלה ${fileList.length} קבצים...`);

    const formData = new FormData();
    Array.from(fileList).forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("http://localhost:8000/ingest", { method: "POST", body: formData });
      const data = await res.json();
      const chunks = data.chunks ?? data.total_chunks ?? 0;
      setStatus("done");
      setMessage(`${chunks} חלקים נוספו`);
      setFiles((prev) => [
        ...prev,
        ...Array.from(fileList).map((f) => ({ name: f.name, chunks: Math.ceil(chunks / fileList.length) })),
      ]);
      onIngested(chunks);
    } catch {
      setStatus("error");
      setMessage("שגיאה בהעלאה");
    }
  };

  return (
    <aside
      className="flex h-full w-72 shrink-0 flex-col border-l border-sidebar-border bg-sidebar"
      dir="rtl"
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-sidebar-heading">מסמכים</h2>
      </div>

      {/* Drop zone */}
      <div className="px-4 pb-4">
        <div
          className={`group cursor-pointer rounded-lg border border-dashed p-4 transition-all duration-200 ${
            dragOver
              ? "border-foreground/30 bg-accent"
              : "border-sidebar-border hover:border-foreground/20 hover:bg-accent/50"
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
              {status === "uploading" ? message : "גרור קבצים או לחץ כאן"}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      {totalChunks > 0 && (
        <div className="mx-4 mb-3 rounded-md bg-accent/50 px-3 py-2 animate-fade-in">
          <p className="text-xs text-muted-foreground">{totalChunks} חלקים במאגר</p>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {files.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground animate-slide-in"
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate flex-1">{f.name}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="mx-4 mb-4 rounded-md bg-destructive/10 px-3 py-2 animate-fade-in">
          <p className="text-xs text-destructive">{message}</p>
        </div>
      )}
    </aside>
  );
};

export default UploadSidebar;
