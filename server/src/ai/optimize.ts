// src/ai/optimize.ts
import { ChatOllama } from '@langchain/ollama'; 
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOllama({
  model: 'llama3',
  baseUrl: 'http://localhost:11434',
});

const prompt = PromptTemplate.fromTemplate(`
  You are a professional UI/UX designer.
  
  Optimize the following HTML element for the goal: "{goal}".
  
  🎯 Design goals:
  - Use a **modern, colorful palette** (multiple accent colors)
  - Make it **visually engaging**
  - Include subtle **hover effects and transitions**
  - Ensure it's **accessible** (contrast, font size, ARIA if needed)
  - Include **Google Fonts** if text is used
  - Use **rounded corners**, shadows, or gradients if helpful
  
  🚫 No explanations.
  ✅ Return output in this format ONLY:
  
  <optimized>
  <!-- HTML -->
  ...your HTML...
  
  <!-- CSS -->
  <style>
  ...your CSS...
  </style>
  </optimized>
  
  Element to optimize:
  {element}
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
