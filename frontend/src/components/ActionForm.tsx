import type React from "react";

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
    <div className="mt-6 mb-6 bg-red-50 p-6 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold mb-4 text-red-800">
        Perform Action
      </h3>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Action:
      </label>
      <input
        type="text"
        className="w-full border border-red-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        placeholder="Type the action here..."
        value={action}
        onChange={(e) => setAction(e.target.value)}
      />
      <button
        className="w-full bg-red-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={() => handleAction(action, connections, prompt)}
        disabled={!action}
      >
        Perform Action
      </button>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-red-800">Response:</h3>
        <p className="text-gray-800 break-words whitespace-pre-wrap bg-white p-4 rounded-lg border border-red-300">
          {response}
        </p>
      </div>
    </div>
  );
};
