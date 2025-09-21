# Undefined Meet

Simple self-hosted meeting app that uses Jitsi for video conferencing, plus a minimal React frontend and a small Node.js backend for auth/JWT and light API work.

## Stack

- Frontend: React + Vite
- Backend: Node.js (Express) — issues JWTs, handles GitHub OAuth and users API
- Video: [Jitsi Meet](https://jitsi.org/jitsi-meet/)
- Web server / TLS: Nginx on the host (recommended) or a containerized reverse proxy
- Orchestration: docker-compose for Backend and Jitsi services

## Quick links

- Jitsi self-hosting docs (handbook): [https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker/](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker/)

## Run locally

1. Clone repository:

```bash
git clone https://github.com/EvgenyWas/undefined-meet.git
cd undefined-meet
```

2. Install dependencies from the monorepo root

```bash
pnpm install
```

3. Copy `.env.example` to `.env`, run `gen-passwords.sh` and fill the rest of environment variables which are marked `xxx`

4. Run required services in docker:

```bash
docker compose up -d
```
