import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'http';
import { WebSocketServer } from 'ws';

let wss: WebSocketServer;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!wss) {
    const server: Server = res.socket.server;
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === 'text') {
          ws.send(JSON.stringify({ type: 'text', content: `Echo: ${data.content}` }));
        }
      });
    });

    console.log('WebSocket server started');
  } else {
    console.log('WebSocket server already running');
  }

  res.status(200).json({ message: 'WebSocket server is running' });
}
