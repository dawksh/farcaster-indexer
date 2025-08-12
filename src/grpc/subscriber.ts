import { type MessageEnvelope, MessageType } from "../types";
import {
  type HubRpcClient,
  getSSLHubRpcClient,
  getInsecureHubRpcClient,
  fromFarcasterTime,
  bytesToHexString,
  Message as HubMessage,
  MessageData as HubMessageData,
  HubEventType,
  type HubEvent,
  MessageType as HubMsgType,
} from "@farcaster/hub-nodejs";

type OnMessage = (m: MessageEnvelope) => void | Promise<void>;

const randomHash = () => crypto.randomUUID().replace(/-/g, "");

const mkMockMessage = (fid: number): MessageEnvelope => ({
  hash: randomHash(),
  signer: randomHash(),
  data: {
    type: MessageType.CAST_ADD,
    fid,
    timestamp: Math.floor(Date.now() / 1000),
    network: 1,
    body: { text: "hello" },
  },
  raw: null,
});

export const startSubscriber = async (onMessage: OnMessage) => {
  const useMock =
    process.env.MOCK === "true" || !process.env.SNAPCHAIN_GRPC_ENDPOINT;

  let timer: ReturnType<typeof setInterval> | null = null;

  if (useMock) {
    timer = setInterval(() => void onMessage(mkMockMessage(1)), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }

  const endpoint = process.env.SNAPCHAIN_GRPC_ENDPOINT as string;
  const insecure = process.env.SNAPCHAIN_GRPC_INSECURE === "true";
  const maxRecv = 10 * 1024 * 1024;
  const maxSend = 1 * 1024 * 1024;
  const clientOptions: any = {
    "grpc.max_receive_message_length": maxRecv,
    "grpc.max_send_message_length": maxSend,
  };
  const client: HubRpcClient = insecure
    ? getInsecureHubRpcClient(endpoint, clientOptions)
    : getSSLHubRpcClient(endpoint, clientOptions);

  await new Promise((resolve) => {
    client.$.waitForReady(Date.now() + 10000, async (error) => {
      if (error) {
        resolve(error);
      } else {
        resolve(undefined);
      }
    });
  });

  const mapType = (t: HubMsgType): MessageType => {
    switch (t) {
      case HubMsgType.CAST_ADD:
        return MessageType.CAST_ADD;
      case HubMsgType.CAST_REMOVE:
        return MessageType.CAST_REMOVE;
      case HubMsgType.REACTION_ADD:
        return MessageType.REACTION_ADD;
      case HubMsgType.REACTION_REMOVE:
        return MessageType.REACTION_REMOVE;
      case HubMsgType.LINK_ADD:
        return MessageType.LINK_ADD;
      case HubMsgType.LINK_REMOVE:
        return MessageType.LINK_REMOVE;
      case HubMsgType.VERIFICATION_ADD_ETH_ADDRESS:
        return MessageType.VERIFICATION_ADD_ETH_ADDRESS;
      case HubMsgType.VERIFICATION_REMOVE:
        return MessageType.VERIFICATION_REMOVE;
      case HubMsgType.USER_DATA_ADD:
        return MessageType.USER_DATA_ADD;
      case HubMsgType.USERNAME_PROOF:
        return MessageType.USERNAME_PROOF;
      case HubMsgType.FRAME_ACTION:
        return MessageType.FRAME_ACTION;
      default:
        return MessageType.CAST_ADD;
    }
  };

  const convert = (m: HubMessage): MessageEnvelope => {
    const data = m.data as HubMessageData;
    return {
      hash: bytesToHexString(m.hash)._unsafeUnwrap(),
      hashScheme: String(m.hashScheme),
      signature: bytesToHexString(m.signature)._unsafeUnwrap(),
      signatureScheme: String(m.signatureScheme),
      signer: bytesToHexString(m.signer)._unsafeUnwrap(),
      raw: m.dataBytes,
      data: {
        type: mapType(data.type as unknown as HubMsgType),
        fid: Number(data.fid),
        timestamp: Number(fromFarcasterTime(data.timestamp)._unsafeUnwrap()),
        network: Number(data.network),
        body: (data as any).body,
      },
    };
  };

  const eventTypes = [
    HubEventType.MERGE_ON_CHAIN_EVENT,
    HubEventType.MERGE_MESSAGE,
    HubEventType.MERGE_USERNAME_PROOF,
    HubEventType.PRUNE_MESSAGE,
    HubEventType.REVOKE_MESSAGE,
  ];

  const subscribeResult = await client.subscribe({
    eventTypes,
  });

  if (subscribeResult.isOk()) {
    const stream = subscribeResult.value as AsyncIterable<HubEvent>;
    (async () => {
      for await (const event of stream) {
        console.log(event);
        if (
          event.type === HubEventType.MERGE_MESSAGE &&
          event.mergeMessageBody?.message
        ) {
          void onMessage(convert(event.mergeMessageBody.message));
        }
      }
    })();
  } else {
    console.error("subscribe error", subscribeResult.error);
  }

  return () => {
    client.close();
  };
};
