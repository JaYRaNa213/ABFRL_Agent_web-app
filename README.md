# ABFRL_Agent_web-app

## 🛍️ ABFRL AI-Driven Omnichannel Conversational Sales Agent

An **Agentic AI Sales Assistant** designed for ABFRL Retail that delivers a **seamless, human-like, omnichannel shopping experience** across web, mobile apps, messaging platforms, and in-store kiosks.

This system emulates a **top-tier sales associate**, orchestrating multiple specialized AI Worker Agents to guide customers from product discovery to checkout and post-purchase support — all while maintaining session continuity across channels.

---

## 🚀 Problem Statement

Retail customers face fragmented experiences when switching between:
- Online browsing
- Mobile apps
- Messaging platforms (WhatsApp / Telegram)
- In-store kiosks or POS systems

Sales associates have limited bandwidth, resulting in:
- Missed upsell & cross-sell opportunities
- Lower conversion rates
- Reduced Average Order Value (AOV)

---

## 🎯 Solution Overview

We propose an **Agentic AI Architecture** where a central **Sales Agent** orchestrates multiple **Worker Agents**, enabling:

- Unified omnichannel conversations
- Personalized recommendations
- Real-time inventory visibility
- Seamless payment & fulfillment
- Intelligent post-purchase engagement

---
 ## Agent + Web app (voice chat)
 
<img src="https://github.com/JaYRaNa213/ABFRL_Agent_web-app/blob/main/public/voice_chat.PNG" > 

## Agent + Web app ( text chat )
<img src="https://github.com/JaYRaNa213/ABFRL_Agent_web-app/blob/main/public/text_chat.PNG"  > 


## 🧠 Agentic Architecture
```
Customer (Any Channel)
↓
SALES AGENT (LLM Orchestrator)
↓
┌────────────┬────────────┬────────────┬────────────┐
│Recommendation│ Inventory │ Payment │ Fulfillment│
│ Agent │ Agent │ Agent │ Agent │
└────────────┴────────────┴────────────┴────────────┘
↓
Loyalty & Post-Purchase Support

markdown
Copy code
```
---

## 🤖 AI Roles & Responsibilities

### 🧑‍💼 Sales Agent (Orchestrator)
- Manages multi-channel conversation flow
- Maintains session continuity across devices
- Routes tasks to Worker Agents
- Uses consultative sales psychology to increase AOV

### 🧠 Worker Agents
```
| Agent | Responsibility |
|-----|---------------|
| Recommendation Agent | Personalized product & bundle suggestions |
| Inventory Agent | Real-time stock across warehouses & stores |
| Payment Agent | Handles UPI, cards, wallets & retries |
| Fulfillment Agent | Ship-to-home / click-&-collect / reserve-in-store |
| Loyalty & Offers Agent | Applies coupons, loyalty points, pricing |
| Post-Purchase Agent | Returns, exchanges, feedback & tracking |
```
---

## 🛠️ Technology Stack

### 🔹 AI & Agent Framework
- **OpenAI GPT-4 / GPT-4o** – Core conversational intelligence
- **LangChain** – Prompt & tool orchestration
- **LangGraph / CrewAI** – Agentic workflows
- **OpenAI Embeddings** – Semantic memory
- **Redis** – Session & conversation memory

### 🔹 Backend & APIs
- **Node.js**
- **Express.js**
- **MongoDB** – Customer, product & order data
- **REST APIs** – Mocked services
- **WebSockets** – Real-time updates
- **JWT Authentication**

### 🔹 Omnichannel Interfaces (Demo Level)
- **Web Chat** – React
- **Mobile App** – React Native
- **WhatsApp / Telegram** – Mock Twilio / Bot APIs
- **In-Store Kiosk** – React Web
- **Voice Assistant** – Whisper (STT) + TTS (optional)

### 🔹 Simulated Enterprise Services
- Product Catalog API (Mock)
- Inventory Server (Real-time simulation)
- Payment Gateway Stub
- Loyalty & Promotions Rules Engine
- POS Integration Simulator

---

## 📁 Project Structure
```
abfrl-sales-agent/
│
├── README.md
├── package.json
├── .env
├── .gitignore
│
├── src/
│ ├── index.js # App entry point
│ ├── server.js # Express server
│ │
│ ├── config/
│ │ ├── env.js
│ │ └── llm.config.js
│ │
│ ├── agents/
│ │ ├── sales.agent.js
│ │ ├── recommendation.agent.js
│ │ ├── inventory.agent.js
│ │ ├── payment.agent.js
│ │ ├── fulfillment.agent.js
│ │ └── loyalty.agent.js
│ │
│ ├── routes/
│ │ ├── chat.route.js
│ │ ├── inventory.route.js
│ │ └── payment.route.js
│ │
│ ├── services/
│ │ ├── product.service.js
│ │ ├── inventory.service.js
│ │ └── loyalty.service.js
│ │
│ └── utils/
│ └── session.util.js


```
yaml
Copy code

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

PORT=5000
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017/abfrl-agent
REDIS_URL=redis://localhost:6379

r
Copy code

---

## ▶️ How to Run the Project Locally

### 1️⃣ Navigate to the project directory
```bash
cd C:\Users\vsran\OneDrive\Documents\Desktop\hackathons\EY\agent_last\abfrl-sales-agent
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Start the development server
bash
Copy code
npm run dev
🌐 Application Ports
Service	Port
Backend API	http://localhost:5000
WebSocket	ws://localhost:5000
Mock APIs	Same server

🔄 Omnichannel Session Continuity
Each user session is identified by:

ini
Copy code
session_id = user_id + device_id
Enables seamless transitions:

Mobile App → In-Store Kiosk

Web Chat → WhatsApp

Voice → Web

⚠️ Edge Case Handling
Scenario	System Response
Product out of stock	Suggest alternatives
Payment failure	Retry / change method
Store unavailable	Ship-to-home
Size issue	Exchange flow
Order modification	Agent-guided update

📈 Business Impact
📊 Increased Average Order Value (AOV)

📈 Higher conversion rates

🧠 Personalized customer journeys

👥 Reduced in-store staff load

❤️ Improved loyalty & retention

📦 Deliverable
✔️ 5-Slide PPT
✔️ Agentic AI Architecture
✔️ Omnichannel Demo Flow
✔️ End-to-End Orchestration
✔️ Edge-Case Handling

🏁 Final Note
This project demonstrates how Agentic AI can transform retail experiences by combining:

Human-like conversations

Intelligent orchestration

Enterprise-grade modularity

Built specifically for ABFRL Retail – EY Hackathon Challenge V.

👨‍💻 Author: Team ABFRL Sales Agent
🏆 Category: Retail | Agentic AI | Omnichannel Experience

yaml
Copy code

---

If you want next, I can:
- Align this README exactly with your **current code**
- Create the **5-slide PPT content**
- Write **Sales Agent prompts**
- Prepare a **live demo narration script**

Just tell me 👉 **next step**


