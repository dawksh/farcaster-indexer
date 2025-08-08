import { PrismaClient } from "@prisma/client"
import type { MessageEnvelope } from "../types"
import { MessageType } from "../types"

type Handler = (prisma: PrismaClient, message: MessageEnvelope) => Promise<void>

export const upsertEnvelope = (prisma: PrismaClient, message: MessageEnvelope) =>
  prisma.message.upsert({
    where: { hash: message.hash },
    update: {},
    create: {
      hash: message.hash,
      fid: message.data.fid,
      type: message.data.type as any,
      timestamp: message.data.timestamp,
      network: message.data.network,
      signer: message.signer,
      hashScheme: message.hashScheme,
      signature: message.signature,
      sigScheme: message.signatureScheme,
      raw: message.raw ? Buffer.from(message.raw) : null
    }
  })

export const dispatchAndPersist = async (prisma: PrismaClient, message: MessageEnvelope) => {
  const handler = handlers[message.data.type]
  if (!handler) return upsertEnvelope(prisma, message).then(() => {})
  await handler(prisma, message)
}

import { handleCast } from "./handlers/cast"
import { handleReaction } from "./handlers/reaction"
import { handleLink } from "./handlers/link"
import { handleVerification } from "./handlers/verification"
import { handleUserData } from "./handlers/userdata"

const handlers: Record<MessageType, Handler | undefined> = {
  [MessageType.CAST_ADD]: handleCast,
  [MessageType.CAST_REMOVE]: handleCast,
  [MessageType.REACTION_ADD]: handleReaction,
  [MessageType.REACTION_REMOVE]: handleReaction,
  [MessageType.LINK_ADD]: handleLink,
  [MessageType.LINK_REMOVE]: handleLink,
  [MessageType.LINK_COMPACT_STATE]: handleLink,
  [MessageType.VERIFICATION_ADD_ETH_ADDRESS]: handleVerification,
  [MessageType.VERIFICATION_REMOVE]: handleVerification,
  [MessageType.USER_DATA_ADD]: handleUserData,
  [MessageType.USERNAME_PROOF]: handleUserData,
  [MessageType.FRAME_ACTION]: undefined
}

