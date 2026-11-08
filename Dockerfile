# Stage 1: Build Frontend (Figma root files)
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# pnpm setup
RUN corepack enable && corepack prepare pnpm@10 --activate

# Figma ki files copy karo root se
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Baaki ka saara code copy karo (.figma, src, public sab)
COPY . .

# Frontend build karo
RUN pnpm build

# Stage 2: Python Backend
FROM python:3.12-slim AS runtime
WORKDIR /app

# DB ke liye system dependency
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*

# Backend dependencies install karo
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Backend code copy karo
COPY backend/ ./backend/

# Frontend ka build (dist) copy karo
COPY --from=frontend-builder /app/dist ./frontend/dist

WORKDIR /app/backend
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]