import React from "react";

function TranscriptPanel({ transcript }: { transcript: string }) {
  const documentRef = React.useRef<HTMLDivElement>(null);

  const fixTranscript = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/fix-transcript`
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            Document Content
          </h2>
          <button type="button" onClick={fixTranscript}>
            Fix Transcript
          </button>
        </div>
        <div
          ref={documentRef}
          className="h-96 overflow-y-auto p-6 text-gray-700 leading-relaxed"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: transcript.replace(/\n\s+/g, "<br><br>"),
            }}
          /> */}
          {transcript}
        </div>
      </div>
    </div>
  );
}

export default TranscriptPanel;
