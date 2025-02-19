import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [loading, setLoading] = useState(false); // State to track loading
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Updated dependency

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line
      setLoading(true); // Start loading
      if (prompt.startsWith("transfer")) {
        handleAction("transfer", connections.sonic, prompt);
      } else if (prompt === "get-balance") {
        handleAction("get-balance", connections.sonic, prompt); // Call get-balance action
      } else if (prompt.startsWith("list-topics")) {
        handleAction("list-topics", connections.allora, prompt); // Call get-inference action
      } else if (prompt.startsWith("get-inference")) {
        handleAction("get-inference", connections.allora, prompt); // Call get-inference action
      } else {
        handleAction("generate-text", connections, prompt); // Call generate-text action for other cases
      }
    }
  };

  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

    // Split text and filter out undefined values
    return text
      .split(urlRegex)
      .filter(Boolean)
      .map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part.startsWith("http") ? part : `https://${part}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      });
  };

  // Handle new message and stop loading
  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender !== "user") {
      setLoading(false); // Stop loading when new message is added
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-[80vh] bg-gray-100 rounded-lg shadow-lg"
    >
      {/* Chat Messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-3 max-w-xs lg:max-w-md rounded-xl shadow ${
                  message.sender === "user"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-900 border border-gray-300"
                }`}
              >
                {renderMessageWithLinks(message.text)}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex justify-center mt-4"
          >
            <div className="animate-spin rounded-full border-t-4 border-blue-500 w-8 h-8"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border-t border-gray-300 p-3 bg-white flex items-center"
      >
        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          className="flex-1 resize-none border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type a message..."
          value={prompt}
          rows={1}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setLoading(true); // Start loading
            if (prompt.startsWith("transfer")) {
              handleAction("transfer", connections.sonic, prompt);
            } else if (prompt === "get-balance") {
              handleAction("get-balance", connections.sonic, prompt); // Call get-balance action
            } else if (prompt.startsWith("list-topics")) {
              handleAction("list-topics", connections.allora, prompt); // Call get-inference action
            } else if (prompt.startsWith("get-inference")) {
              handleAction("get-inference", connections.allora, prompt); // Call get-inference action
            } else {
              handleAction("generate-text", connections, prompt); // Call generate-text action for other cases
            }
          }}
          className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          {loading ? (
            <div className="animate-spin rounded-full border-t-4 border-white w-5 h-5"></div>
          ) : prompt === "get-balance" ||
            prompt.startsWith("get-inference") ||
            prompt.startsWith("list-topics") ||
            prompt.startsWith("transfer") ? (
            "Action"
          ) : (
            "Send"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
