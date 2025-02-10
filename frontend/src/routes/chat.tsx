"use client";

import { useState, useEffect } from "react";
import { ConnectionsDropdown } from "../components/ConnectionsDropdown";
import { ChatWindow } from "../components/ChatWindow";
import { ActionForm } from "../components/ActionForm";
import { GarudaLogo } from "../components/GarudaLogo";

export default function GarudaFAI() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [connections, setConnections] = useState({});
  const [loadStatus, setLoadStatus] = useState("");
  const [response, setResponse] = useState("Awaiting response...");
  const [selectedConnection, setSelectedConnection] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [action, setAction] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://localhost:8000/agents");
        const data = await res.json();
        setAgents(data.agents || []);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const handleLoadAgent = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/agents/${selectedAgent}/load`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setLoadStatus(`Agent ${selectedAgent} loaded successfully!`);
        const connectionsRes = await fetch("http://localhost:8000/connections");
        const connectionsData = await connectionsRes.json();
        setConnections(connectionsData.connections || {});
      } else {
        throw new Error("Failed to load agent");
      }
    } catch (error) {
      setLoadStatus(`Error: ${error.message}`);
    }
  };

  const handleAction = async (action, connections, prompt) => {
    // ... (keep the existing handleAction logic)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-700 to-red-900">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <GarudaLogo className="w-20 h-20" />
          <h1 className="text-4xl font-bold text-red-800 ml-4">GarudaFAI</h1>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Agent
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="">-- Select Agent --</option>
            {agents.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLoadAgent}
          disabled={!selectedAgent}
          className="mb-6 bg-red-600 text-white py-3 px-6 rounded-full w-full font-semibold hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Load Agent
        </button>

        {loadStatus && (
          <p className="mb-6 text-green-600 font-semibold text-center">
            {loadStatus}
          </p>
        )}

        <ConnectionsDropdown
          connections={connections}
          setSelectedConnection={setSelectedConnection}
        />

        {selectedConnection &&
          connections[selectedConnection]?.is_llm_provider && (
            <ChatWindow
              messages={messages}
              prompt={prompt}
              setPrompt={setPrompt}
              handleAction={handleAction}
              connections={connections}
            />
          )}

        {selectedConnection &&
          !connections[selectedConnection]?.is_llm_provider && (
            <ActionForm
              action={action}
              setAction={setAction}
              handleAction={handleAction}
              connections={connections}
              prompt={prompt}
              response={response}
            />
          )}
      </div>
    </div>
  );
}
