# farcaster-indexer

To install dependencies:

```bash
bun install
```

Environment:

```bash
cp .env.example .env
```

Generate Prisma client:

```bash
bun run prisma:generate
```

Run subscriber (ingests to Redis):

```bash
bun run src/index.ts
```

Run worker (processes and writes to Postgres):

```bash
bun run src/worker/worker.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
