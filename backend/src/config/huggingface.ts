import { InferenceClient } from "@huggingface/inference";
import { config } from ".";

const apiKey = config.HUGGINGFACE_KEY;

export const client = new InferenceClient(apiKey);

