export enum MessageType {
  CAST_ADD = "CAST_ADD",
  CAST_REMOVE = "CAST_REMOVE",
  REACTION_ADD = "REACTION_ADD",
  REACTION_REMOVE = "REACTION_REMOVE",
  LINK_ADD = "LINK_ADD",
  LINK_REMOVE = "LINK_REMOVE",
  LINK_COMPACT_STATE = "LINK_COMPACT_STATE",
  VERIFICATION_ADD_ETH_ADDRESS = "VERIFICATION_ADD_ETH_ADDRESS",
  VERIFICATION_REMOVE = "VERIFICATION_REMOVE",
  USER_DATA_ADD = "USER_DATA_ADD",
  USERNAME_PROOF = "USERNAME_PROOF",
  FRAME_ACTION = "FRAME_ACTION"
}

export type MessageEnvelope = {
  hash: string
  hashScheme?: string
  signature?: string
  signatureScheme?: string
  signer: string
  data: MessageData
  raw?: Uint8Array | null
}

export type MessageData = {
  type: MessageType
  fid: number
  timestamp: number
  network: number
  body: unknown
}

