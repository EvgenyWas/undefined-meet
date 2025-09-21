FROM node:22.15-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -F ./server build
RUN pnpm -F ./server --prod deploy /app/pruned

FROM node:22.15-slim AS runtime
ENV SERVER_PORT=4062
WORKDIR /app

COPY --from=build /app/pruned /app

EXPOSE $SERVER_PORT
CMD [ "node", "dist/server.js" ]