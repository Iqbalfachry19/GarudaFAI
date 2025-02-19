import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface AgentSelectorProps {
  agents: string[];
  selectedAgent: string;
  onSelectAgent: (agent: string) => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-6 relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Agent
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
            {selectedAgent || "-- Select Agent --"}
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
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            >
              {agents.map((agent) => (
                <li
                  key={agent}
                  className={cn(
                    "cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-red-100 transition-colors duration-200",
                    {
                      "bg-red-50": selectedAgent === agent,
                    }
                  )}
                  onClick={() => {
                    onSelectAgent(agent);
                    setIsOpen(false);
                  }}
                >
                  <span className="block truncate font-medium">{agent}</span>
                  {selectedAgent === agent && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red-600">
                      <Check className="h-5 w-5" />
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
