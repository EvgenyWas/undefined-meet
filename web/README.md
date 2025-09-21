# Undefined Meet Web app

React single-page app. Build produces static files that should be served by Nginx (host) or any static server.

### Run locally

(Optional if the dependencies are installed from the monorepo root)

```bash
cd web
pnpm install
pnpm dev
```

or from the monorepo root

```bash
pnpm start:web
```

### Build for production

```bash
cd web
pnpm build
# output in web/dist
```
