import React from "react";

export const ChatMessage = ({
  message,
}: {
  message: { role: "user" | "assistant"; content: string };
}) => {
  return (
    <div className="mb-4">
      <p className="font-bold">{message.role}</p>
      <p>{message.content}</p>
    </div>
  );
};
