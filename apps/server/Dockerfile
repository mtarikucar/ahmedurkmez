# Multi-stage build for NestJS application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Install all dependencies for building
FROM base AS deps-all
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps-all /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Create uploads directory
RUN mkdir -p uploads
RUN chown nestjs:nodejs uploads

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy email templates
COPY --chown=nestjs:nodejs src/mail/templates ./dist/mail/templates

# Copy package.json for production
COPY --chown=nestjs:nodejs package.json ./

USER nestjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1

# Start the application
CMD ["node", "dist/main.js"]