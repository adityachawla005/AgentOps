import { optimizeElement } from './src/ai/optimize';

(async () => {
  const result = await optimizeElement('<button>Click me</button>', 'clicks');
  console.log('🧠 AI Response:', result);
})();
  