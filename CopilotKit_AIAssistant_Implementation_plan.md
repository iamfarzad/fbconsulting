# CopilotKit AI Assistant Implementation Plan

## 🚀 Phase 1: Model Deployment on Azure AI Foundry

### Goal: Deploy AI model to power the chatbot on the website.


ToDO: need to work with google gemini 2.0 flash 


---

## 🔹 Phase 2: Model Instructions & Context Setup

### Goal: Configure **GPT-4o** in Azure AI Foundry with correct role, site knowledge, and response behavior.



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

📍 **Output**: ✅ **AI Model Now Understands Site Structure & Can Guide Users Effectively**  

---

## 🔹 Phase 3: CopilotKit Integration with Chatbox

### Goal: Connect Azure AI model to CopilotKit and power the website chat.

✅ **Step 3.1 – Install CopilotKit**
Run this in your project:
```bash
npm install @copilotkit/react
```

✅ **Step 3.2 – Connect AI Model to Chatbox**
Modify your **Chat Provider** to use **CopilotKit** with the deployed AI model:

```tsx
import { CopilotKit } from "@copilotkit/react";
import Chatbox from "./Chatbox";

export default function AIChatProvider() {
  return (
    <CopilotKit
      aiConfig={{
        model: "gpt-4o",
        instructions: `
        You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. Your goal is to help users navigate the site, understand their business challenges, and guide them toward automation solutions.
        
        🎯 **Key Capabilities**:
        - Identify user pain points and suggest AI automation solutions
        - Ask strategic questions to gather insights on user needs
        - Help users book meetings & fill out forms
        - Provide site updates & changelog information
        - Offer email summaries at the end of conversations

        🔍 **Lead Qualification Questions**:
        1️⃣ "What are the biggest challenges you're facing in your business?"
        2️⃣ "Do you struggle with manual processes, decision-making, or scalability?"
        3️⃣ "Are there specific tasks you wish could be automated?"
        4️⃣ "What’s your biggest bottleneck right now?"
        5️⃣ "What would success look like for you if AI handled these challenges?"
        
        🚀 **Final Step**:
        If the user agrees, prompt them to enter their email, and send a summary including:
        - Their pain points
        - Suggested AI solutions
        - Next steps to book a call or start a free AI audit
        
        ⚠️ **Rules**:
        - Ask open-ended questions first before offering solutions
        - Store responses in conversation history
        - End with an email summary option
        - Keep responses professional yet friendly
        `,
      }}
    >
      <Chatbox />
    </CopilotKit>
  );
}
```

📍 **Output**: ✅ **AI Chatbox Now Live on Website**  

---

## 🔹 Phase 4: Lead Capture & Pain Point Analysis

### Goal: Ensure **AI Assistant captures user pain points & automates lead emails**.

✅ **Step 4.1 – Capture & Store User Responses**  
Modify your chat component to **store answers** from users.

```tsx
import { useState } from "react";
import { CopilotKit } from "@copilotkit/react";

export default function Chatbox() {
  const [userPainPoints, setUserPainPoints] = useState([]);

  function handleUserResponse(response) {
    setUserPainPoints((prev) => [...prev, response]); // Store pain points
  }

  function handleEmailRequest() {
    const emailContent = `
      Hi [User Name],

      Based on our conversation, here are the key challenges you mentioned:
      ${userPainPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

      ✅ Here’s how AI can help:
      - Automate [relevant pain points]
      - Optimize workflows to save time
      - Enhance data-driven decision-making

      Would you like to discuss this further? Feel free to book a free consultation here: [Booking Link].

      Best,
      Farzad AI Assistant
    `;

    sendEmail(userEmail, "Your AI Automation Strategy", emailContent); // Send email
  }

  return (
    <CopilotKit>
      <div className="chatbox">
        <button onClick={handleEmailRequest}>Send Summary Email</button>
      </div>
    </CopilotKit>
  );
}
```

📍 **Output**: ✅ **User Pain Points Are Captured & Sent as Email Summaries**  

---

## 🔹 Phase 5: Dataset Creation & Fine-Tuning

### Goal: Train the model on **custom data** for better personalization.

✅ **Step 5.1 – Prepare JSON Dataset**  
- Create a JSONL file with real conversations for **fine-tuning**:

```json
{"messages": [{"role": "system", "content": "You are Farzad AI Assistant..."}, {"role": "user", "content": "How can AI help my business?"}, {"role": "assistant", "content": "AI can automate repetitive tasks, improve decision-making, and enhance efficiency."}]}
```

✅ **Step 5.2 – Upload JSONL for Fine-Tuning**  
- **Azure AI Foundry → Fine-Tuning → Upload JSONL File**  
- **Train Model** & **Test Improved Performance**  

📍 **Output**: ✅ **Fine-Tuned AI Model for Better Lead Capture & Automation**  

---

## **🎯 Final Checklist**


✅ **Integrate CopilotKit for Chat**  
✅ **Enable Lead Capture & Email Summaries**  
✅ **Train AI on Real User Data**  

---


