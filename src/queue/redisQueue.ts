import { Queue } from "bullmq"
import IORedis from "ioredis"
import type { MessageEnvelope } from "../types"

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379")

export const ingestionQueue = new Queue<MessageEnvelope>("ingestion", { connection })

export const enqueueMessage = (message: MessageEnvelope) =>
  ingestionQueue.add("message", message, { jobId: message.hash, removeOnComplete: 1000, removeOnFail: 1000 })

