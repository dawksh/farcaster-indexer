import "dotenv/config"
import { startSubscriber } from "../grpc/subscriber"

const main = async () => {
  const stop = await startSubscriber(m => {
    console.log("event", JSON.stringify(m))
  })
  const shutdown = () => {
    stop()
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

main()

