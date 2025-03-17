
# Google Gemini AI Assistant Implementation Plan

## 🚀 Phase 1: Setup Gemini API Access

### Goal: Configure Google Gemini API to power the chatbot on the website.

✅ **Step 1.1 – Set Up Google AI Studio Account**  
- Create/login to a [Google AI Studio](https://ai.google.dev/) account  
- Generate an API key from the Google AI Studio dashboard
- Store the API key in your environment variables as `VITE_GEMINI_API_KEY`
- Verify API access by making a test request to the Gemini API

📍 **Output**: ✅ **Google Gemini API Ready for Integration**  

---

## 🔹 Phase 2: Gemini API Configuration

### Goal: Configure **Gemini AI** with the correct system prompt, instructions, and response behavior.

✅ **Step 2.1 – Create System Instructions for Gemini**  
- Create comprehensive system instructions that will be sent with each request:

```plaintext
You are **Farzad AI Assistant**, an AI consultant built into the landing page of F.B Consulting. Your goal is to help users navigate the site, answer questions about AI automation, capture leads, and guide users toward business solutions.

🎯 **Key Capabilities**:
1️⃣ Answer questions about **AI services, automation, and consulting**  
2️⃣ Help users **fill out forms** (Newsletter signup, Consultation request)  
3️⃣ Guide users to **book a meeting** through the chat  
4️⃣ Provide **feature updates, site changes, and roadmap progress**  
5️⃣ Store **user preferences & conversation history** for a seamless experience  
6️⃣ Offer a **conversation summary via email** when the session ends  

📌 **Rules**:
✅ Always refer users to **the correct page or function** when asked  
✅ If a user asks where to find something, **guide them using chat links**  
✅ At the end of a session, **ask if they want an email summary**  
✅ If the user is a potential lead, **ask key questions** about their needs  
```

📍 **Output**: ✅ **Gemini AI Configured with Effective Instructions**  

---

## 🔹 Phase 3: Chat Interface Integration

### Goal: Connect Gemini API to the website's chat interface.

✅ **Step 3.1 – Implement Gemini API Service**
- Create a service to handle communication with the Gemini API:

```typescript
// src/services/gemini/geminiService.ts

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function sendGeminiChatRequest(messages: GeminiMessage[], apiKey: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

✅ **Step 3.2 – Create Chat Hook and Components**
- Implement a React hook that uses the Gemini service:

```typescript
// src/hooks/useGeminiChat.ts

export const useGeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useGeminiAPI();
  
  const sendMessage = async (content) => {
    if (!apiKey) return;
    setIsLoading(true);
    
    // Add user message
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Prepare messages for Gemini format
    const geminiMessages = convertToGeminiMessages(
      [...messages, userMessage], 
      systemPrompt
    );
    
    try {
      // Get response from Gemini API
      const responseText = await sendGeminiChatRequest(geminiMessages, apiKey);
      
      // Add assistant response
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: responseText }
      ]);
    } catch (error) {
      console.error('Error getting chat response:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { messages, isLoading, sendMessage };
};
```

📍 **Output**: ✅ **Functional Chat Interface Using Gemini API**  

---

## 🔹 Phase 4: Lead Qualification System

### Goal: Implement a system to capture and qualify leads through the chat.

✅ **Step 4.1 – Implement Lead Extraction Logic**  
- Create a service to extract lead information from chat conversations:

```typescript
// Extract user information and pain points from chat
export function extractLeadInfo(messages) {
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  // Simple extraction logic - can be enhanced with ML/classification
  const extractedInfo = {
    name: findName(userMessages),
    email: findEmail(userMessages),
    companyName: findCompanyName(userMessages),
    painPoints: extractPainPoints(userMessages),
    leadStage: determineLeadStage(userMessages)
  };
  
  return extractedInfo;
}
```

✅ **Step 4.2 – Store and Retrieve Lead Information**
- Implement local storage for lead persistence between sessions:

```typescript
export function saveLeadInfo(leadInfo) {
  localStorage.setItem('lead_info', JSON.stringify(leadInfo));
}

export function loadLeadInfo() {
  const data = localStorage.getItem('lead_info');
  return data ? JSON.parse(data) : null;
}
```

📍 **Output**: ✅ **Lead Information Extraction and Storage System**  

---

## 🔹 Phase 5: Voice Input Integration

### Goal: Enable voice input for the chat interface.

✅ **Step 5.1 – Implement Speech Recognition**
- Use the Web Speech API for voice input:

```typescript
export function useSpeechRecognition(onResult) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening]);
  
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // Add recognition event handlers...
    
    recognition.start();
    setIsListening(true);
  };
  
  return { isListening, transcript, toggleListening };
}
```

✅ **Step 5.2 – Integrate Voice Controls into Chat**
- Add voice control buttons and indicators to the chat UI:

```tsx
const VoiceControls = ({ onToggleVoice, isListening }) => {
  return (
    <button 
      onClick={onToggleVoice}
      className={`voice-button ${isListening ? 'listening' : ''}`}
    >
      {isListening ? <MicrophoneIcon /> : <MicrophoneOffIcon />}
      <span className="sr-only">
        {isListening ? 'Stop listening' : 'Start listening'}
      </span>
      
      {isListening && <AnimatedBars />}
    </button>
  );
};
```

📍 **Output**: ✅ **Voice Input for Gemini AI Chat Interface**  

---

## **🎯 Final Checklist**
✅ **Set up Google Gemini API access**  
✅ **Configure Gemini with system instructions**  
✅ **Create chat interface components**  
✅ **Implement lead capture and qualification**  
✅ **Add voice input capabilities**  

---

## 📚 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React State Management Best Practices](https://react.dev/learn/managing-state)

