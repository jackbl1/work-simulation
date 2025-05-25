import React, { useState } from "react";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";

export const ChatPanel = () => {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    { role: "user", content: "placeholder user message" },
    { role: "assistant", content: "placeholder assistant message" },
  ]);
  return (
    <div className="w-[50%] p-4 space-y-4">
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <h2 className="text-md font-semibold text-gray-700">Chat</h2>
        </div>
        <div
          className="overflow-y-auto p-6 text-gray-700 leading-relaxed"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          <ChatInput />
        </div>
      </div>
    </div>
  );
};
