# Base AI agent app

A command-line AI agent built with Node.js and the OpenAI API that uses a structured **PLAN → ACTION → OBSERVATION → OUTPUT** reasoning loop to answer user queries. It demonstrates basic tool-calling by fetching weather details for Indian cities through a local function the model invokes.

## How it works

The agent follows a state-machine prompting pattern. For each user message, the model:

1. **PLAN** — decides which tool to use.
2. **ACTION** — calls the tool with arguments (in JSON).
3. **OBSERVATION** — receives the tool's result, fed back into the conversation.
4. **OUTPUT** — produces the final natural-language answer.

The loop repeats until the model emits an `output` message, then waits for the next user prompt.

## Tools

| Tool | Description |
| --- | --- |
| `getWeatherDetails(city)` | Returns the current weather for a supported city (Patiala, Mohali, Bengaluru, Chennai, Delhi). |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

Run the agent:

```bash
node index.js
```

You'll be prompted for input. Try asking:

```
User: What is the weather in Bengaluru?
🤖: The weather in Bengaluru is 20°C.
```

The agent prints its intermediate thought process (plan, action, observation) before the final answer.

## Tech stack

- [openai](https://www.npmjs.com/package/openai) — OpenAI API client (model: `gpt-4o`)
- [dotenv](https://www.npmjs.com/package/dotenv) — environment variable management
- [readline-sync](https://www.npmjs.com/package/readline-sync) — synchronous CLI input

## License

ISC
