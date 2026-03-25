import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface UploadPanelProps {
  onIngested: (chunks: number) => void;
}

const UploadPanel = ({ onIngested }: UploadPanelProps) => {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | File[]) => {
    if (!files.length) return;
    setStatus("uploading");
    setMessage(`מעלה ${files.length} קבצים...`);

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("http://localhost:8000/ingest", { method: "POST", body: formData });
      const data = await res.json();
      const chunks = data.ingested?.reduce((sum: number, f: any) => sum + (f.chunks_ingested ?? 0), 0) ?? 0;
      setStatus("done");
      setMessage(`✓ ${chunks} chunks added successfully!`);
      onIngested(chunks);
    } catch {
      setStatus("error");
      setMessage("error uploading files. Please  make sure the server is running.");
    }
  };

  return (
    <div
      className={`rounded-lg border-2 border-dashed p-5 transition-colors ${
        dragOver ? "border-primary bg-primary/5" : "border-upload-border bg-upload"
      }`}
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
      <div className="flex items-center gap-3" dir="rtl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          {status === "uploading" ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : status === "done" ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Upload className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Upload Documents</p>
          {message ? (
            <p className={`text-xs mt-0.5 ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
              {message}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">Drag and drop PDF or Excel files here</p>
          )}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          בחר קבצים
        </button>
      </div>
    </div>
  );
};

export default UploadPanel;
