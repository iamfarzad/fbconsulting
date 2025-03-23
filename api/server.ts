import express from 'express';
import cors from 'cors';
import { handler as geminiAskHandler } from './gemini/ask';
import { handler as geminiTestHandler } from './gemini/test';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/gemini/ask', geminiAskHandler);
app.post('/api/gemini/test', geminiTestHandler);

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
