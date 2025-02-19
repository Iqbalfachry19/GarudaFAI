import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface ConnectionsDropdownProps {
  connections: Record<string, any>;
  setSelectedConnection: (connection: string) => void;
}

export const ConnectionsDropdown: React.FC<ConnectionsDropdownProps> = ({
  connections,
  setSelectedConnection,
}) => {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (connections["groq"]?.configured) {
      setSelected("groq");
      setSelectedConnection("groq");
    }
  }, [connections, setSelectedConnection]);

  const configuredConnections = Object.entries(connections).filter(
    ([_, connectionDetails]) => connectionDetails.configured
  );

  if (configuredConnections.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ delay: 0.8 }}
      className="mb-6 relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Connection
      </label>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between border border-red-300 rounded-lg p-3 bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 text-left"
        >
          <span className="block truncate">
            {selected
              ? connections[selected].name || selected
              : "-- Select Connection --"}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform duration-200",
              {
                "transform rotate-180": isOpen,
              }
            )}
          />
        </button>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          >
            {configuredConnections.map(
              ([connectionName, connectionDetails]) => (
                <li
                  key={connectionName}
                  className={cn(
                    "cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-red-100 transition-colors duration-200",
                    {
                      "bg-red-50": selected === connectionName,
                    }
                  )}
                  onClick={() => {
                    setSelected(connectionName);
                    setSelectedConnection(connectionName);
                    setIsOpen(false);
                  }}
                >
                  <span className="block truncate font-medium">
                    {connectionDetails.name || connectionName}
                  </span>
                  {selected === connectionName && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red-600">
                      <Check className="h-5 w-5" />
                    </span>
                  )}
                  <span className="block truncate text-sm text-gray-500">
                    {connectionDetails.is_llm_provider && "LLM Provider"}
                  </span>
                </li>
              )
            )}
          </motion.ul>
        )}
      </motion.div>
    </motion.div>
  );
};
