import React, { useState, useEffect } from "react";

function App() {
  const [agents, setAgents] = useState([]); // Store available agents
  const [selectedAgent, setSelectedAgent] = useState(""); // Selected agent
  const [connections, setConnections] = useState({}); // Store available connections (as an object)
  const [loadStatus, setLoadStatus] = useState(""); // Status for loading the agent
  const [response, setResponse] = useState("Awaiting response..."); // Response from the action
  const [selectedConnection, setSelectedConnection] = useState(""); // Selected connection
  const [prompt, setPrompt] = useState(""); // State for storing the prompt
  const [messages, setMessages] = useState([]); // Store chat history
  const [action, setAction] = useState("");
  useEffect(() => {
    // Fetch the list of agents on component mount
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
      // Load the selected agent
      const res = await fetch(
        `http://localhost:8000/agents/${selectedAgent}/load`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setLoadStatus(`Agent ${selectedAgent} loaded successfully!`);

        // Once the agent is loaded, fetch the connections
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
    if (!selectedConnection) {
      setResponse("Please select a connection.");
      return;
    }

    // Parse the action and its arguments from the input string
    const actionParts = action.trim().split(" ");
    const actionName = actionParts[0]; // The first part is the action name
    const actionArgs = actionParts.slice(1); // The rest are the arguments

    // Check if the selected connection is an LLM provider
    const isLLMProvider = connections[selectedConnection]?.is_llm_provider;

    // Declare requestBody outside the conditional blocks
    const requestBody = {
      connection: selectedConnection,
      action: actionName, // Always set the action name
      params: actionArgs.length > 0 ? [...actionArgs] : [], // Add arguments if available
    };
    console.log(requestBody.params);

    // Add the system prompt only for LLM providers if the prompt is not empty
    if (isLLMProvider && prompt.trim()) {
      requestBody.params.unshift(prompt); // Add prompt at the beginning
      requestBody.params.push("You are a helpful AI assistant");
    }

    try {
      // Make the POST request
      const res = await fetch("http://localhost:8000/agent/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      // Check if the result is an array of objects and stringify them for readability
      if (Array.isArray(data.result)) {
        setResponse(
          data.result.map((item) => JSON.stringify(item, null, 2)).join("\n")
        );
      } else {
        // Check if the response is an object with topic_id and inference
        if (data.result && data.result.topic_id && data.result.inference) {
          setResponse(
            `Topic ID: ${data.result.topic_id}\nInference: ${data.result.inference}`
          );
        } else {
          setResponse(data.result || "No result returned");
        }
      }

      // Add the user's message and bot response to the chat history
      setMessages([
        ...messages,
        { sender: "user", text: isLLMProvider ? prompt : action }, // Log action instead of prompt
        { sender: "bot", text: data.result || "No result returned" },
      ]);
    } catch (error) {
      setResponse("Error occurred while performing the action.");
    }
  };

  const renderMessageWithLinks = (text) => {
    // Convert the text to a string if it's not already a string
    let textToRender = text;

    if (typeof text !== "string") {
      // If it's an object, convert it to JSON string
      try {
        textToRender = JSON.stringify(text, null, 2);
      } catch (error) {
        // If the object can't be stringified, fallback to default string
        textToRender = String(text);
      }
    }

    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g; // Match http, https, or www links

    return textToRender.split(urlRegex).map((part, index) => {
      // Check if part is a string and contains a URL
      if (typeof part === "string" && part.match(urlRegex)) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          ZerePy Chatbot
        </h2>

        {/* Select Agent */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Select Agent
          </label>
          <select
            className="mt-2 w-full border border-gray-300 rounded-lg p-2"
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

        {/* Load Agent Button */}
        <button
          onClick={handleLoadAgent}
          disabled={!selectedAgent}
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-full w-full"
        >
          Load Agent
        </button>

        {/* Load Status */}
        {loadStatus && <p className="mt-4 text-green-600">{loadStatus}</p>}

        {/* Select Connection */}
        <ConnectionsDropdown
          connections={connections}
          setSelectedConnection={setSelectedConnection}
        />

        {/* Chat Window (only show if LLM provider is selected) */}
        {selectedConnection &&
          connections[selectedConnection]?.is_llm_provider && (
            <div className="mt-6 mb-4 bg-gray-50 p-4 h-72 overflow-y-auto rounded-lg shadow-inner">
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex break-words whitespace-pre-wrap ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg break-words whitespace-pre-wrap ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {renderMessageWithLinks(message.text)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Chat Input (only show if LLM provider is selected) */}
        {selectedConnection &&
          connections[selectedConnection]?.is_llm_provider && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Enter Prompt
              </label>
              <input
                type="text"
                className="mt-2 w-full border border-gray-300 rounded-lg p-2"
                placeholder="Type your message..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          )}

        {/* Send Button (only show if LLM provider is selected) */}
        {selectedConnection &&
          connections[selectedConnection]?.is_llm_provider && (
            <button
              onClick={() => handleAction("generate-text", connections, prompt)}
              className="mt-2 bg-green-500 text-white py-2 px-4 rounded-full w-full"
            >
              Send
            </button>
          )}

        {/* Normal Form for Non-LLM Providers */}
        {selectedConnection &&
          !connections[selectedConnection]?.is_llm_provider && (
            <div className="mt-6 mb-4 bg-gray-50 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold mb-4">Perform Action</h3>
              <label className="block text-sm font-medium text-gray-600">
                Action:
              </label>
              <input
                type="text"
                className="mt-2 w-full border border-gray-300 rounded-lg p-2"
                placeholder="Type the action here..."
                value={action} // Bind the input value to the action state
                onChange={(e) => setAction(e.target.value)} // Update action state on input change
              />

              <button
                className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded-full w-full"
                onClick={() => handleAction(action, connections, prompt)} // Pass the action input to handleAction
                disabled={!action} // Disable the button if no action is provided
              >
                Perform Action
              </button>
            </div>
          )}

        {/* Response Section */}
        <div className="mt-4">
          {selectedConnection &&
            !connections[selectedConnection]?.is_llm_provider && (
              <>
                <h3 className="text-lg font-semibold">Response:</h3>
                <p className="text-gray-800 break-words whitespace-pre-wrap">
                  {String(response) // Convert any response to a string
                    .split(/(\s+)/) // Split by spaces while keeping spaces
                    .map((word, index) =>
                      /^https?:\/\/[^\s]+$/.test(word) ? ( // Check if it's a URL
                        <a
                          key={index}
                          href={word}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all"
                        >
                          {word}
                        </a>
                      ) : (
                        word // Render normal text
                      )
                    )}
                </p>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;

const ConnectionsDropdown = ({ connections, setSelectedConnection }) => {
  // Filter out connections that are not configured
  const configuredConnections = Object.entries(connections).filter(
    ([_, connectionDetails]) => connectionDetails.configured
  );

  // If no connections are configured, return null (hide the dropdown)
  if (configuredConnections.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 mt-6">
      <label className="block text-sm font-medium text-gray-600">
        Select Connection
      </label>
      <select
        className="mt-2 w-full border border-gray-300 rounded-lg p-2"
        onChange={(e) => setSelectedConnection(e.target.value)}
      >
        <option value="">-- Select Connection --</option>
        {configuredConnections.map(([connectionName, connectionDetails]) => {
          const isLLMProvider = connectionDetails.is_llm_provider;
          return (
            <option key={connectionName} value={connectionName}>
              {connectionName}
              {connectionDetails.configured && " (Configured)"}
              {isLLMProvider && " - LLM Provider"}
            </option>
          );
        })}
      </select>
    </div>
  );
};
