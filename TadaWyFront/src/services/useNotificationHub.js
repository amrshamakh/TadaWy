import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { TokenService } from "./tokenService";
import { ENV } from "../config/env";
import i18n from "../i18n";
import { useAuth } from "../context/AuthContext";

const HUB_URL = ENV.API_URL.replace("/api", "") + "/notificationhub";

export const useNotificationHub = (onNotificationReceived) => {
  const { user } = useAuth();
  const [connection, setConnection] = useState(null);
  const onNotificationReceivedRef = useRef(onNotificationReceived);

  useEffect(() => {
    onNotificationReceivedRef.current = onNotificationReceived;
  }, [onNotificationReceived]);

  useEffect(() => {
    const token = TokenService.getToken() || localStorage.getItem("userToken");
    const language = i18n.language || "en";
    const acceptLanguage = language.startsWith("ar") ? "ar-EG" : "en-US";
    
    if (!token) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.LongPolling,
        headers: { "Accept-Language": acceptLanguage }
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to Notification SignalR Hub");
        setConnection(newConnection);

        newConnection.on("ReceiveNotification", (notification) => {
          if (onNotificationReceivedRef.current) {
            onNotificationReceivedRef.current(notification);
          }
        });
      })
      .catch((err) => console.error("Notification SignalR Connection Error: ", err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [i18n.language, user]);

  return { connection };
};
