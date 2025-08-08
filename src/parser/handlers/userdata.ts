import { PrismaClient } from "@prisma/client"
import type { MessageEnvelope } from "../../types"
import { upsertEnvelope } from ".."

export const handleUserData = async (prisma: PrismaClient, message: MessageEnvelope) => {
  await upsertEnvelope(prisma, message)
  await prisma.userData.upsert({
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

