import { Expo } from "expo-server-sdk";
import type { ExpoPushTicket } from "expo-server-sdk";
import { env } from "@repo/server-config";

const expo = new Expo({
  accessToken: env.EXPO_ACCESS_TOKEN,
});

export async function sendPushNotifications(
  pushTokens: string[],
  title: string,
  body?: string,
) {
  const messages = pushTokens.map((pushToken) => ({
    to: pushToken,
    sound: "default" as const,
    title,
    body,
  }));

  const chunks = expo.chunkPushNotifications(messages);
  const tickets: (ExpoPushTicket & { pushToken: string })[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(
        ...ticketChunk.map((ticket, index) => ({
          ...ticket,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pushToken: chunk[index]!.to as string,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  const devicesWithErrors = tickets.filter(
    (ticket) =>
      ticket.status === "error" &&
      ticket.details?.error === "DeviceNotRegistered",
  );

  return devicesWithErrors.map((ticket) => ticket.pushToken);
}
