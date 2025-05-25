import React from "react";

export const ChatInput = () => {
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
  };

  return (
    <form className="flex gap-2 w-full" onSubmit={handleSubmit}>
      <input
        className="flex-1 p-2 border border-gray-300 rounded-lg"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};
