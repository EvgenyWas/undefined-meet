# Undefined Meet Backend app

Minimal Node.js service used for authentication, JWT generation for Jitsi rooms, and users API endpoints.

### Run locally

(Optional if the dependencies are installed from the monorepo root)

```bash
cd server
pnpm install
pnpm run dev
```

or from the monorepo root

```bash
pnpm start:server
```

### Run in Docker

- Provide environment environment variables (e.g. `/srv/undefined-meet/.env`).

```bash
docker compose up --build server
```

### Key notes

- Mount a read-only `github-whitelist.txt` file (e.g. `/srv/undefined-meet/github-whitelist.txt:/app/github-whitelist.txt:ro`).
- Mount a host directory for logs (e.g. `/srv/undefined-meet/server/server.log:/app/server.log`) rather than mounting a single file onto a path inside a read-only image layer.
