import type React from "react";

interface ConnectionsDropdownProps {
  connections: Record<string, any>;
  setSelectedConnection: (connection: string) => void;
}

export const ConnectionsDropdown: React.FC<ConnectionsDropdownProps> = ({
  connections,
  setSelectedConnection,
}) => {
  const configuredConnections = Object.entries(connections).filter(
    ([_, connectionDetails]) => connectionDetails.configured
  );

  if (configuredConnections.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Connection
      </label>
      <select
        className="w-full border border-red-300 rounded-lg p-3 bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
        onChange={(e) => setSelectedConnection(e.target.value)}
      >
        <option value="">-- Select Connection --</option>
        {configuredConnections.map(([connectionName, connectionDetails]) => (
          <option key={connectionName} value={connectionName}>
            {connectionName}
            {connectionDetails.configured && " (Configured)"}
            {connectionDetails.is_llm_provider && " - LLM Provider"}
          </option>
        ))}
      </select>
    </div>
  );
};
