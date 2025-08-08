import "dotenv/config"
import pino from "pino"
import { enqueueMessage } from "./queue/redisQueue"
import { startSubscriber } from "./grpc/subscriber"

const logger = pino({ level: process.env.LOG_LEVEL || "info" })

const main = async () => {
  const stop = await startSubscriber(async m => {
    await enqueueMessage(m)
  })

  const shutdown = () => {
    stop()
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
  logger.info("subscriber started")
}

main()