import { PrismaClient } from "@prisma/client"
import type { MessageEnvelope } from "../../types"
import { upsertEnvelope } from ".."

export const handleVerification = async (prisma: PrismaClient, message: MessageEnvelope) => {
  await upsertEnvelope(prisma, message)
  await prisma.verification.upsert({
    where: { messageHash: message.hash },
    update: { body: message.data.body as any },
    create: {
      messageHash: message.hash,
      fid: message.data.fid,
      timestamp: message.data.timestamp,
      body: message.data.body as any
    }
  })
}

