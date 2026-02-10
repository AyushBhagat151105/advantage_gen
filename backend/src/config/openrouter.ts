import { config } from ".";
import { OpenRouter } from "@openrouter/sdk";

export const openRouter = new OpenRouter({
    apiKey: config.OPENROUTER_KEY
})