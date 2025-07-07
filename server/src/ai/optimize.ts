// src/ai/optimize.ts
import { ChatOllama } from '@langchain/ollama'; // ✅ modern package
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOllama({
  model: 'llama3',
  baseUrl: 'http://localhost:11434',
});

const prompt = PromptTemplate.fromTemplate(`
You are an expert UX designer.

Improve the following HTML element to increase {goal}:

ELEMENT:
{element}

Provide:
- New optimized HTML
- Short explanation why it works better
`);

const chain = RunnableSequence.from([
  prompt,
  model,
  new StringOutputParser(),
]);

export async function optimizeElement(element: string, goal: string) {
  const result = await chain.invoke({ element, goal });
  return result;
}
