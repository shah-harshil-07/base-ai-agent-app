import OpenAI from "openai";
import dotenv from "dotenv";
import readLineSync from "readline-sync";

dotenv.config();

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tool
function getWeatherDetails(city = "") {
  switch (city.toLowerCase()) {
    case "patiala":
      return "10°C.";
    case "mohali":
      return "15°C.";
    case "bengaluru":
      return "20°C.";
    case "chennai":
      return "30°C.";
    case "delhi":
      return "25°C.";
    default:
      return `Sorry, I don't have weather information for ${city}.`;
  }
}

const SYSTEM_PROMPT = `You're an AI assistant with START, PLAN, OBSERVATION AND OUTPUT state.
Wait for the user prompt and first PLAN using available tools.
After planning, take necessary ACTIONS using the tools and wait for the OBSERVATION based on ACTION.
Once you get the OBSERVATION, return the AI response based on START prompt and OBSERVATION.

Strictly follow the JSON output format as in examples.

Available tools:
1. function getWeatherDetails(city: string): string
A function that takes a city name as input and returns the current weather details for that city.

Example:
START
{ "type": "user", "user": "What is the weather in Patiala?" }
{ "type": "plan", "plan": "Let me call getWeatherDetails for Patiala" }
{ "type": "action", "function": "getWeatherDetails", "arguments": { "city": "Patiala" } }
{ "type": "observation", "observation": "10°C." }
{ "type": "output", "output": "The weather in Patiala is 10°C." }
`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

const tools = {
  getWeatherDetails,
};

while (true) {
  const userMessage = readLineSync.question("User: ");
  const q = { type: "user", user: userMessage };

  messages.push({ role: "user", content: JSON.stringify(q) });

  while (true) {
    const chat = await openaiClient.chat.completions.create({
      messages,
      model: "gpt-4o",
      response_format: {
        type: "json_object",
      },
    });

    const result = chat.choices[0].message.content;
    messages.push({ role: "assistant", content: result });

    console.log(`Assistant thought output => `, result);
    console.log(`------------------------------`);

    const parsedResult = JSON.parse(result);

    if (parsedResult.type === "output") {
      console.log(`🤖: ${parsedResult.output}`);
      break;
    } else if (parsedResult.type === "action") {
      const { function: functionName, arguments: args } = parsedResult;
      const fn = tools[functionName];
      let observation = fn(args.city);
      const observationMessage = {
        type: "observation",
        observation,
      };
      messages.push({ role: "developer", content: JSON.stringify(observationMessage) });
    }
  }
}


