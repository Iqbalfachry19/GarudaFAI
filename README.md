# GarudaFAI

GarudaFAI is an innovative project built on the Zerepy AI Agents Framework that leverages decentralized finance (DeFi) on the Sonic. The project name fuses the Indonesian national symbol “Garuda” with “FAI” (short for Financial AI), evoking strength, agility, and visionary technology while keeping its identity entirely in English.

## Features

### Core Platform

- CLI interface for managing agents
- Modular connection system
- Blockchain integration

### Platform Integrations
- Social Platforms:
  - Twitter/X
  - Farcaster
  - Echochambers
  - Discord
- Blockchain Networks:
  - EVM Networks:
    - Sonic 
- AI/ML Tools:
  - GOAT (Onchain Agent Toolkit)
  - Allora (Network inference)

### Language Model Support

- Allora
- GROQ API

## Requirements

System:

- Python 3.11 or higher
- Poetry 1.5 or higher

Environment Variables:

- LLM: make an account and grab an API key (at least one)
  - GROQ: https://console.groq.com/
- Social (based on your needs):
  - X API: https://developer.x.com/en/docs/authentication/oauth-1-0a/api-key-and-secret
- On-chain Integration:
  - Sonic: private keys

## Installation

1. First, install Poetry for dependency management if you haven't already:

Follow the steps here to use the official installation: https://python-poetry.org/docs/#installing-with-the-official-installer

2. Clone the repository:

```bash
git clone https://github.com/Iqbalfachry19/GarudaFAI.git
```

3. Go to the `zerepy` directory:

```bash
cd GarudaFAI
```

4. Install dependencies:

```bash
poetry install --no-root
```

This will create a virtual environment and install all required dependencies.

## Usage

1. Activate the virtual environment:

```bash
poetry shell
```

2. Run the application:

```bash
poetry run python main.py --server --host 0.0.0.0 --port 8000
```

2. Run the frontend:

```bash
cd frontend
npm i
npm run dev
```
## Configure connections & launch an agent

1. Configure your desired connections:

   ```
   configure-connection twitter    # For Twitter/X integration
   configure-connection goat       # For Goat
   configure-connection sonic      # For Sonic
   configure-connection groq       # For GROQ
   ```

2. Use `list-connections` to see all available connections and their status

3. Load your agent (usually one is loaded by default, which can be set using the CLI or in agents/general.json):

   ```
   load-agent example
   ```

4. Start your agent:
   ```
   start
   ```

## GOAT Integration

GOAT (Go Agent Tools) is a powerful plugin system that allows your agent to interact with various blockchain networks and protocols. Here's how to set it up:

### Prerequisites

1. An RPC provider URL (e.g., from Infura, Alchemy, or your own node)
2. A wallet private key for signing transactions

### Installation

Install any of the additional [GOAT plugins](https://github.com/goat-sdk/goat/tree/main/python/src/plugins) you want to use:

```bash
poetry add goat-sdk-plugin-erc20         # For ERC20 token interactions
poetry add goat-sdk-plugin-coingecko     # For price data
```

### Configuration

1. Configure the GOAT connection using the CLI:

   ```bash
   configure-connection goat
   ```

   You'll be prompted to enter:

   - RPC provider URL
   - Wallet private key (will be stored securely in .env)

2. Add GOAT plugins configuration to your agent's JSON file:

   ```json
   {
     "name": "YourAgent",
     "config": [
       {
         "name": "goat",
         "plugins": [
           {
             "name": "erc20",
             "args": {
               "tokens": [
                 "goat_plugins.erc20.token.PEPE",
                 "goat_plugins.erc20.token.USDC"
               ]
             }
           }
         ]
       }
     ]
   }
   ```

Note that the order of plugins in the configuration doesn't matter, but each plugin must have a `name` and `args` field with the appropriate configuration options. You will have to check the documentation for each plugin to see what arguments are available.

### Available Plugins

Each [plugin](https://github.com/goat-sdk/goat/tree/main/python/src/plugins) provides specific functionality:


- **erc20**: Interact with ERC20 tokens (transfer, approve, check balances)

Note: While these plugins are available in the GOAT SDK, you'll need to install them separately using Poetry and configure them in your agent's JSON file. Each plugin may require its own API keys or additional setup.

### Plugin Configuration

Each plugin has its own configuration options that can be specified in the agent's JSON file:

1. **ERC20 Plugin**:

   ```json
   {
     "name": "erc20",
     "args": {
       "tokens": [
         "goat_plugins.erc20.token.USDC",
         "goat_plugins.erc20.token.PEPE",
         "goat_plugins.erc20.token.DAI"
       ]
     }
   }
   ```

2. **Coingecko Plugin**:
   ```json
   {
     "name": "coingecko",
     "args": {
       "api_key": "YOUR_COINGECKO_API_KEY"
     }
   }
   ```

## Platform Features

### GOAT
- Unified EVM chain interface
- ERC20 token management (balances, transfers, approvals)
- Real-time crypto data and market tracking
- Plugin system for protocol integrations
- Multi-chain support with secure wallet management

### Blockchain Networks
- Solana
  - SOL/SPL transfers and swaps via Jupiter
  - Staking and balance management
  - Network monitoring and token queries

- EVM Networks
  - Ethereum
    - ETH/ERC-20 transfers and swaps
    - Kyberswap integration
    - Balance and token queries
  - Sonic
    - Fast EVM transactions
    - Custom slippage settings
    - Token swaps via Sonic DEX
    - Network switching (mainnet/testnet)

- EternalAI
  - Transform agents to smart contracts
  - Deploy on 10+ blockchains
  - Onchain system prompts
  - Decentralized inference

### Social Platforms
- Twitter/X
  - Post and reply to tweets
  - Timeline management
  - Engagement features

- Farcaster
  - Cast creation and interactions
  - Timeline and reply management
  - Like/requote functionality

- Discord
  - Channel management
  - Message operations
  - Reaction handling

- Echochambers
  - Room messaging and context
  - History tracking
  - Topic management


## Available Commands

Use `help` in the CLI to see all available commands. Key commands include:

- `list-agents`: Show available agents
- `load-agent`: Load a specific agent
- `agent-loop`: Start autonomous behavior
- `agent-action`: Execute single action
- `list-connections`: Show available connections
- `list-actions`: Show available actions for a connection
- `configure-connection`: Set up a new connection
- `chat`: Start interactive chat with agent
- `clear`: Clear the terminal screen

