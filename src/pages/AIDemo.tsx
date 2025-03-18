import React, { useEffect, useState } from 'react';

const AIDemo = () => {

  const [messages, setMessages] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState('top');

  // Log spatial context changes
  const logEvent = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Scroll to bottom of log
  useEffect(() => {
    const logContainer = document.getElementById('event-log');
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AI Features Demo</h1>
        
        {/* Spatial Understanding Test */}
        <section id="section1" className="mb-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Section 1: Spatial Understanding</h2>
          <p className="mb-4">
            This section demonstrates spatial awareness. The AI assistant tracks your location
            on the page and understands context based on where you are.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => logEvent('Button clicked in Section 1')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Button 1
            </button>
            <input
              type="text"
              placeholder="Test input field"
              className="block w-full p-2 border rounded"
              onChange={(e) => logEvent(`Input changed: ${e.target.value}`)}
            />
          </div>
        </section>

        {/* Voice Synthesis Test */}
        <section id="section2" className="mb-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Section 2: Voice Synthesis</h2>
          <p className="mb-4">
            This section tests the Charon voice synthesis. The AI assistant can respond
            using voice when appropriate.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => logEvent('Voice synthesis requested')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Voice Synthesis
            </button>
          </div>
        </section>

        {/* Agentic Capabilities Test */}
        <section id="section3" className="mb-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Section 3: Agentic Capabilities</h2>
          <p className="mb-4">
            This section demonstrates proactive assistance and learning capabilities.
            The AI will suggest actions based on your behavior.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => logEvent('Proactive assistance triggered')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Test Proactive Assistance
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => logEvent('Frequent action 1 triggered')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Frequent Action 1
              </button>
              <button
                onClick={() => logEvent('Frequent action 2 triggered')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Frequent Action 2
              </button>
            </div>
          </div>
        </section>

        {/* Event Log */}
        <section id="event-log" className="p-6 bg-white rounded-lg shadow max-h-60 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Event Log</h2>
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div key={index} className="text-sm text-gray-600">
                {message}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIDemo;
