import { useState } from "react";
import UploadSidebar from "@/components/UploadSidebar";
import ChatWindow from "@/components/ChatWindow";

const Index = () => {
  const [totalChunks, setTotalChunks] = useState(0);

  return (
    <div className="flex h-screen">
      <UploadSidebar
        totalChunks={totalChunks}
        onIngested={(n) => setTotalChunks((prev) => prev + n)}
      />
      <main className="flex flex-1 flex-col min-h-0">
        <ChatWindow />
      </main>
    </div>
  );
};

export default Index;
