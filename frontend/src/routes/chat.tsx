import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectionsDropdown } from "../components/ConnectionsDropdown";
import { ChatWindow } from "../components/ChatWindow";
import { ActionForm } from "../components/ActionForm";
import { GarudaLogo } from "../components/GarudaLogo";
import { AnimatedGaruda } from "../components/AnimatedGaruda";
import { AgentSelector } from "../components/AgentSelector";

export default function GarudaFAI() {
  const [agents, setAgents] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("garudafai");
  const [connections, setConnections] = useState({});
  const [loadStatus, setLoadStatus] = useState("");
  const [response, setResponse] = useState("Awaiting response...");
  const [selectedConnection, setSelectedConnection] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [action, setAction] = useState("");
  const [garudaPosition, setGarudaPosition] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://localhost:8000/agents");
        const data = await res.json();
        setAgents(data.agents || []);

        // Auto-load "garudafai" if available
        if (data.agents.includes("garudafai")) {
          handleLoadAgent("garudafai");
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const handleLoadAgent = async (agentName: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/agents/${agentName}/load`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setLoadStatus(`Agent ${agentName} loaded successfully!`);
        setSelectedAgent(agentName);

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
    // Make sure a connection is selected
    if (!selectedConnection) {
      setResponse("Please select a connection.");
      return;
    }

    // Split the action into parts (action name and arguments)
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

    // Handle 'transfer' action
    if (actionName === "transfer") {
      const actionParts = prompt.trim().split(" ");
      const actionArgs = actionParts.slice(1); // The rest are the arguments
      requestBody.params = actionArgs; // Assuming "sonic" is the connection name for balance check

      const [recipient, amount] = actionArgs;

      requestBody.connection = "sonic"; // Assuming "sonic" is the connection name for balance check

      // Prepare the transfer request body
      requestBody.action = "transfer"; // Ensure the action is 'transfer'
      requestBody.params = [recipient, amount]; // Add recipient and amount as params
      console.log(requestBody);
      try {
        const res = await fetch("http://localhost:8000/agent/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        // Check if the transfer was successful
        if (data.result) {
          setResponse(`Transfer successful: ${data.result}`);
        } else {
          setResponse(
            "Error: Transfer requires both recipient address and amount."
          );
        }

        // Add the transfer action and its response to the chat history
        setMessages([
          ...messages,
          { sender: "user", text: prompt },
          {
            sender: "bot",
            text: data.result
              ? `Transfer successful: ${data.result}`
              : "Transfer requires both recipient address and amount.",
          },
        ]);
      } catch (error) {
        setResponse("Error occurred while processing the transfer.");
      }

      return; // Skip further processing for this action
    }

    // Handle get-balance action separately
    if (actionName === "get-balance") {
      // For 'get-balance', handle it specifically with the "sonic" connection
      requestBody.connection = "sonic"; // Assuming "sonic" is the connection name for balance check

      try {
        const res = await fetch("http://localhost:8000/agent/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        // Check for balance and handle accordingly
        if (data.result) {
          setResponse(`Balance: ${data.result}`);
        } else {
          setResponse("Error: No balance information returned.");
        }

        // Add the 'get-balance' action and its response to the chat history
        setMessages([
          ...messages,
          { sender: "user", text: prompt },
          {
            sender: "bot",
            text: data.result
              ? `Balance: ${data.result}`
              : "No balance information",
          },
        ]);
      } catch (error) {
        setResponse("Error occurred while fetching the balance.");
      }

      return; // Skip further processing for this action
    }
    if (actionName === "list-topics") {
      requestBody.connection = "allora"; // Set connection name

      try {
        const res = await fetch("http://localhost:8000/agent/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        // Check if result exists and handle accordingly
        if (data.result) {
          const topics = data.result
            .map(
              (topic) =>
                `Topic ID: ${topic.topic_id}
  Name: ${topic.topic_name}
  Epoch Length: ${topic.epoch_length} seconds
  Ground Truth Lag: ${topic.ground_truth_lag} seconds
  Loss Method: ${topic.loss_method}
  Worker Submission Window: ${topic.worker_submission_window} minutes
  Worker Count: ${topic.worker_count}
  Reputer Count: ${topic.reputer_count}
  Total Staked Allocation: ${topic.total_staked_allo}
  Total Emissions Allocation: ${topic.total_emissions_allo}
  Active: ${topic.is_active ? "Yes" : "No"}
  Last Updated: ${topic.updated_at}
  --------------------------`
            )
            .join("\n");

          setResponse(`Topics:\n\n${topics}`);
        } else {
          setResponse("Error: No topics information returned.");
        }

        // Add the 'list-topics' action and its response to the chat history
        setMessages([
          ...messages,
          { sender: "user", text: prompt },
          {
            sender: "bot",
            text:
              data.result && data.result.length
                ? `Topics:\n\n` +
                  data.result
                    .map(
                      (topic) =>
                        `🔹 **${topic.topic_name}** (ID: ${topic.topic_id})\n` +
                        `   - Epoch Length: ${topic.epoch_length} sec\n` +
                        `   - Ground Truth Lag: ${topic.ground_truth_lag} sec\n` +
                        `   - Loss Method: ${topic.loss_method}\n` +
                        `   - Worker Submission Window: ${topic.worker_submission_window} min\n` +
                        `   - Workers: ${topic.worker_count}, Reputers: ${topic.reputer_count}\n` +
                        `   - Staked Allocation: ${topic.total_staked_allo}\n` +
                        `   - Emissions Allocation: ${topic.total_emissions_allo}\n` +
                        `   - Active: ${
                          topic.is_active ? "✅ Yes" : "❌ No"
                        }\n` +
                        `   - Last Updated: ${topic.updated_at}`
                    )
                    .join("\n\n")
                : "No topics information available.",
          },
        ]);
      } catch (error) {
        setResponse("Error occurred while fetching the topics.");
      }

      return; // Skip further processing for this action
    }

    // Handle get-inference action
    if (actionName.startsWith("get-inference")) {
      requestBody.action = "get-inference"; // Set action name for inference
      requestBody.connection = "allora";

      const actionParts = prompt.trim().split(" ");
      const actionArgs = actionParts.slice(1); // The rest are the arguments
      requestBody.params = actionArgs; // Assuming "sonic" is the connection name for balance check

      try {
        const res = await fetch("http://localhost:8000/agent/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        // Check if the result is an object or array and handle accordingly
        if (data.result) {
          // If it's an object, stringify it for readability
          const resultString =
            typeof data.result === "object"
              ? JSON.stringify(data.result, null, 2) // Pretty-print the object
              : data.result;

          setResponse(`Inference: ${resultString}`);
        } else {
          setResponse("Missing required parameters: topic_id");
        }

        // Add the 'get-inference' action and its response to the chat history
        setMessages([
          ...messages,
          { sender: "user", text: prompt },
          {
            sender: "bot",
            text: data.result
              ? `Inference: ${
                  typeof data.result === "object"
                    ? JSON.stringify(data.result, null, 2)
                    : data.result
                }`
              : "Missing required parameters: topic_id",
          },
        ]);
      } catch (error) {
        setResponse("Error occurred while performing the inference.");
      }

      return; // Skip further processing for this action
    }

    // Handle actions for LLM providers with a prompt
    if (isLLMProvider && prompt.trim()) {
      requestBody.params.unshift(prompt); // Add the prompt to the request parameters
      requestBody.params.push(
        "You are GarudaFAI, an advanced AI agent designed to interact with decentralized networks, AI models, and social platforms. Your capabilities include:\n" +
          "1. Interacting with blockchain networks (e.g., checking balances, transferring tokens)\n" +
          "2. Querying and analyzing data from decentralized platforms\n" +
          "3. Generating text and answering questions using various AI models\n" +
          "4. Performing actions on social media platforms\n" +
          "5. Accessing and processing information from diverse data sources\n" +
          "6. Executing smart contracts and interacting with DApps\n" +
          "7. Providing insights and recommendations based on blockchain and AI data\n" +
          "Please provide clear and concise responses, and ask for clarification if needed."
      );
    }

    // Process other actions (non-balance, non-inference)
    try {
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
        setResponse(data.result || "No result returned");
      }

      // Add the user's message and bot response to the chat history
      setMessages([
        ...messages,
        { sender: "user", text: isLLMProvider ? prompt : action },
        { sender: "bot", text: data.result || "No result returned" },
      ]);
    } catch (error) {
      setResponse("Error occurred while performing the action.");
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const windowWidth = window.innerWidth;
    const mouseX = e.clientX;
    const leftPosition = Math.max(-40, (mouseX / windowWidth) * 80 - 40);
    const rightPosition = Math.min(
      40,
      ((windowWidth - mouseX) / windowWidth) * 80 - 40
    );
    setGarudaPosition({ left: leftPosition, right: rightPosition });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-700 to-red-900 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Left Garuda */}
      <motion.div
        className="absolute left-0 top-1/2 transform -translate-y-1/2"
        animate={{ x: garudaPosition.left }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <AnimatedGaruda className="w-64 h-64 opacity-70" direction="left" />
      </motion.div>

      {/* Right Garuda */}
      <motion.div
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
        animate={{ x: garudaPosition.right }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <AnimatedGaruda className="w-64 h-64 opacity-70" direction="right" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl relative z-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-6"
        >
          <GarudaLogo className="w-20 h-20" />
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-red-800 ml-4"
          >
            GarudaFAI
          </motion.h1>
        </motion.div>

        <AgentSelector
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={handleLoadAgent}
        />

        <AnimatePresence>
          {loadStatus && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mb-6 text-green-600 font-semibold text-center"
            >
              {loadStatus}
            </motion.p>
          )}
        </AnimatePresence>

        <ConnectionsDropdown
          connections={connections}
          setSelectedConnection={setSelectedConnection}
        />

        <AnimatePresence>
          {selectedConnection &&
            connections[selectedConnection]?.is_llm_provider && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatWindow
                  messages={messages}
                  prompt={prompt}
                  setPrompt={setPrompt}
                  handleAction={handleAction}
                  connections={connections}
                />
              </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedConnection &&
            !connections[selectedConnection]?.is_llm_provider && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ActionForm
                  action={action}
                  setAction={setAction}
                  handleAction={handleAction}
                  connections={connections}
                  prompt={prompt}
                  response={response}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
