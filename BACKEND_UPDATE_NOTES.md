# Backend Update for Frontend (`lovable.dev`)

Hi! Just pushed some updates to the backend service (`main` branch) that affect frontend integration:

1.  **Environment Fixed:** The backend environment in IDX (`.idx/dev.nix`) is now stable and includes all necessary Python dependencies. The service should run reliably via the "backend" preview.
2.  **CORS Update:** Crucially, `https://lovable.dev` has been added to the CORS `ALLOWED_ORIGINS` list. Your frontend should now be able to connect to the WebSocket endpoint (`/ws/{client_id}`) without CORS errors.
3.  **New `/version` Endpoint:** Added a simple `GET /version` endpoint that returns `{"version": "0.1.0"}`.
4.  **API Docs:** FastAPI now generates interactive API documentation (Swagger UI). You can access this at the `/docs` path relative to the backend preview URL in IDX. It details the REST endpoints (`/version`, `/health`) and the WebSocket endpoint.
5.  **WebSocket Handling:** Made internal improvements to connection handling, error reporting, and timeouts on the WebSocket server.

**Connecting the Frontend:**

The backend preview is running successfully in IDX. To connect your WebSocket client, use the following URL format:

```
wss://8000-idx-fbconsulting-1742973637350.cluster-6yqpn75caneccvva7hjo4uejgk.cloudworkstations.dev/ws/{client_id}
```

*   Make sure to use `wss://` (secure WebSocket).
*   Replace `{client_id}` with a unique identifier for each connection.
*   The underlying server is listening on port 8000 within the IDX environment, which is mapped to this public URL.

Let me know if you encounter any issues connecting from `lovable.dev` or have questions about using the backend service!
