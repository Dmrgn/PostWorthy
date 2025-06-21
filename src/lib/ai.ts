import Cerebras from '@cerebras/cerebras_cloud_sdk';
import OpenAI from 'openai';
import {GUIDE} from "./prompts"

const client = new Cerebras({
    apiKey: process.env['CEREBRAS_API_KEY'],
});

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env['OPENROUTER_API_KEY'],
    defaultHeaders: {
        'HTTP-Referer': 'https://danielmorgan.xyz',
        'X-Title': 'Adsistance',
    },
});

export async function getCerebrasResponse(prompt: string) {
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'qwen-3-32b',
    });

    return chatCompletion?.choices[0]?.message?.content.split("</think>")[1];
}

export async function getOpenRouterResponse(prompt: string) {
    const completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-chat:free',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}
