import type React from "react";
import { motion } from "framer-motion";

interface ActionFormProps {
  action: string;
  setAction: (action: string) => void;
  handleAction: (action: string, connections: any, prompt: string) => void;
  connections: Record<string, any>;
  prompt: string;
  response: string;
}

export const ActionForm: React.FC<ActionFormProps> = ({
  action,
  setAction,
  handleAction,
  connections,
  prompt,
  response,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6 mb-6 bg-red-50 p-6 rounded-lg shadow-inner"
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold mb-4 text-red-800"
      >
        Perform Action
      </motion.h3>
      <motion.label
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Action:
      </motion.label>
      <motion.input
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileFocus={{ scale: 1.02 }}
        type="text"
        className="w-full border border-red-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        placeholder="Type the action here..."
        value={action}
        onChange={(e) => setAction(e.target.value)}
      />
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-red-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={() => handleAction(action, connections, prompt)}
        disabled={!action}
      >
        Perform Action
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="text-lg font-semibold mb-2 text-red-800"
        >
          Response:
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-gray-800 break-words whitespace-pre-wrap bg-white p-4 rounded-lg border border-red-300"
        >
          {response}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
