# Snapchain Indexer

A Farcaster indexer that polls the Pinata Hub API for new casts and stores them in PostgreSQL with Redis caching.

## Features

- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Redis Caching**: Cache-aside pattern to reduce database load
- **Pinata Hub Integration**: REST API client for fetching casts
- **Polling System**: Configurable polling intervals for new data
- **Deduplication**: Prevents duplicate processing via cache checks

## Setup

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Environment variables**:
   Create `.env` file:

   ```
   PINATA_GATEWAY=hub.pinata.cloud
   PINATA_JWT=your_jwt_token
   DATABASE_URL=postgresql://user:pass@localhost:5432/farcaster
   REDIS_URL=redis://localhost:6379
   POLL_INTERVAL_MS=5000
   ```

3. **Database setup**:

   ```bash
   bun run db:generate
   bun run db:push
   ```

4. **Start the indexer**:
   ```bash
   bun run dev
   ```

## Scripts

- `bun run dev`: Start with watch mode
- `bun run start`: Start production
- `bun run db:generate`: Generate Prisma client
- `bun run db:push`: Push schema to database
- `bun run db:migrate`: Run migrations
- `bun run db:studio`: Open Prisma Studio

## Architecture

- **`src/index.ts`**: Entry point with graceful shutdown
- **`src/pinataClient.ts`**: Pinata Hub API wrapper
- **`src/poller.ts`**: Polling loop with pagination
- **`src/processor.ts`**: Cache-aside processing logic
- **`src/db.ts`**: Prisma client and database operations
- **`src/cache.ts`**: Redis client and cache helpers

## LLM Edit Prompts

Use these prompts to enhance the indexer:

### Cache Management

- "Add Redis cache invalidation logic to expire entries after 1 hour."
- "Implement cache warming for frequently accessed FIDs."
- "Add cache hit/miss metrics and logging."

### Database Optimization

- "Implement Prisma batch inserts and retry-on-failure with backoff."
- "Add database connection pooling and health checks."
- "Create database indexes for common query patterns."

### Deduplication & Reliability

- "Add deduplication: check Redis first before hitting DB or API."
- "Implement exponential backoff for API failures."
- "Add circuit breaker pattern for external API calls."

### Performance & Monitoring

- "Refactor polling to use long-poll or webhooks if Hub supports them."
- "Add Prometheus metrics for monitoring."
- "Implement structured logging with correlation IDs."

### Schema & Migrations

- "Add schema migrations using Prisma Migrate and SQL version control."
- "Create additional models for user metadata and reactions."
- "Add database constraints and validation rules."
