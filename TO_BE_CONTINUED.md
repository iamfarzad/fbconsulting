Perfect — here’s your **clean recap** of everything we’ve planned so far, grouped by focus area.

---

## ✅ MCP & Gemini Architecture (Core Plan)

| Area | Task |
|------|------|
| ✅ MCP vision | Use name + email to crawl websites + generate user/business context |
| ✅ `/src/mcp/` | Pipeline system: protocols, services, hooks |
| ✅ Integrate with assistant | Use MCP output to enrich `useCopilotReadable()` |
| ✅ Trigger via LeadCaptureForm | Form → run MCP → Gemini-aware assistant |
| 🧠 `MCP_model_context_protocols.md` | Spec partially deleted → to be restored from changelogs |

---

## ✅ AI Chat Stack

| Area | Task |
|------|------|
| ✅ `GeminiCopilotProvider.tsx` | Centralized state, voice, reducer, tools |
| ✅ `useGeminiService.ts` | Text → `/api/gemini` |
| ✅ `useGeminiWebSocket.ts` | WebSocket → FastAPI stream |
| ✅ Tool registration | `generateProposal`, `showCTAOptions`, etc. |
| ✅ Persona proposal funnel | `LeadCaptureForm.tsx` → `ProposalPreview.tsx` |
| ✅ Voice playback | Gemini TTS output chunks (WAV)

---

## ✅ Backend (Python / FastAPI)

| Area | Task |
|------|------|
| ✅ WebSocket server | `/ws` via `main.py` |
| ✅ Gemini Live API support | `gemini_client.py`, `start_local.py` |
| ✅ Docker support | `Dockerfile`, `docker-compose.yml` |
| ✅ Healthcheck | `/health` endpoint |
| ✅ Tests | `test_websocket.py`, `test_gemini_service.py` |

---

## ✅ Cloud Deployment Planning

| Area | Task |
|------|------|
| ✅ Vercel frontend | Already live and deployed |
| ✅ FastAPI backend | To be deployed via **Google Cloud Run** |
| ✅ Reason for split | Vercel doesn’t support Python/WebSocket backend |
| ✅ Plan: Cloud Run | Cheap, persistent, supports streaming |
| ✅ Cost check | Free tier likely sufficient for your usage |
| 🛠 Next steps | Build `Dockerfile`, `gcloud deploy`, update frontend WS baseURL

---

## ✅ Changelogs / Context

| Area | Task |
|------|------|
| ✅ `/src/changelogs` | All history of vision, versions, tools, direction |
| ✅ `/src/mcp/` is real | Fully implemented, not vaporware |
| ✅ Strategy preserved | Even if AI overwrote some docs, all work is tracked

---

