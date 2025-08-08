import "dotenv/config"
import { Worker } from "bullmq"
import IORedis from "ioredis"
import pino from "pino"
import { dispatchAndPersist } from "../parser"
import { getPrismaClient } from "../db"
import type { MessageEnvelope } from "../types"

const logger = pino({ level: process.env.LOG_LEVEL || "info" })
const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379")
const prisma = getPrismaClient()

const worker = new Worker<MessageEnvelope>(
  "ingestion",
  async job => {
    await dispatchAndPersist(prisma, job.data)
    return { ok: true }
  },
  { connection }
)

worker.on("completed", job => logger.debug({ jobId: job.id }, "job completed"))
worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err }, "job failed"))

