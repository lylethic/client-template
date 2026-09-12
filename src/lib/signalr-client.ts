import * as signalR from "@microsoft/signalr";

/**
 * Factory function to create a SignalR HubConnection.
 *
 * Supports WebSocket → Server-Sent Events → Long Polling fallback automatically.
 * Integrates with the Bearer token from localStorage for authenticated hubs.
 *
 * @param hubUrl - The SignalR hub endpoint (e.g., "/hubs/notifications")
 * @returns A configured HubConnection (not yet started)
 *
 * @example
 * const connection = createSignalRConnection("/hubs/notifications");
 * await connection.start();
 * connection.on("ReceiveNotification", (payload) => {
 *   toast.info(payload.message);
 * });
 */
export function createSignalRConnection(hubUrl: string): signalR.HubConnection {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}${hubUrl}`, {
      accessTokenFactory: () => {
        return typeof window !== "undefined"
          ? (localStorage.getItem("access_token") ?? "")
          : "";
      },
      transport:
        signalR.HttpTransportType.WebSockets |
        signalR.HttpTransportType.ServerSentEvents |
        signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Exponential backoff: 0s, 2s, 10s, 30s
        const delays = [0, 2000, 10000, 30000];
        return delays[retryContext.previousRetryCount] ?? 30000;
      },
    })
    .configureLogging(
      process.env.NODE_ENV === "development"
        ? signalR.LogLevel.Information
        : signalR.LogLevel.Warning,
    )
    .build();
}
