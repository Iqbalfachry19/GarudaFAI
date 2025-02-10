import type React from "react";

interface ChatWindowProps {
  messages: Array<{ sender: string; text: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleAction: (action: string, connections: any, prompt: string) => void;
  connections: Record<string, any>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  prompt,
  setPrompt,
  handleAction,
  connections,
}) => {
  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part.startsWith("http") ? part : `https://${part}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {part}
          </a>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className="mt-6 mb-6">
      <div className="bg-red-50 p-4 h-80 overflow-y-auto rounded-lg shadow-inner mb-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                  message.sender === "user"
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-800 border border-red-300"
                }`}
              >
                {renderMessageWithLinks(message.text)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border border-red-300 rounded-l-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={() => handleAction("generate-text", connections, prompt)}
          className="bg-red-600 text-white py-3 px-6 rounded-r-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};
