## Architecture

- **Type**: Frontend-only static web application.
- **Runtime**: Single `index.html` file with embedded CSS and no JavaScript framework.
- **Routing**: SPA fallback via `vercel.json` rewrites (all requests to `index.html`). Development uses Vite.
- **Canonical Schema**: Defines three page nodes (Home, About, Contact) but all have empty component trees. Visual content lives directly in `index.html`.
- **Backend**: None (`backendProfile: frontend-only`, `backendRuntime: null`).
- **Data Flow**: No API calls, no state management, no client-side logic beyond static rendering.