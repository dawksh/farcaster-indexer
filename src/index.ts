import 'dotenv/config'
import { CastPoller } from './poller'
import { disconnect } from './db'

const poller = new CastPoller()

process.on('SIGINT', async () => {
  console.log('Shutting down...')
  poller.stop()
  await disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down...')
  poller.stop()
  await disconnect()
  process.exit(0)
})

poller.start().catch(console.error)