import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { TokenService } from "./tokenService";
import { ENV } from "../config/env";
import i18n from "../i18n";
import { useAuth } from "../context/AuthContext";

const HUB_URL = ENV.API_URL.replace("/api", "") + "/chatHub";

export const useChatHub = () => {
  const { user } = useAuth();
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const onMessageReceivedRef = useRef(null);
  const onUnreadCountUpdatedRef = useRef(null);
  const onMessagesSeenRef = useRef(null);

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
        console.log("Connected to SignalR Hub");
        setConnection(newConnection);

        newConnection.on("ReceiveMessage", (message) => {
          if (onMessageReceivedRef.current) {
            onMessageReceivedRef.current(message);
          }
        });

        newConnection.on("UnreadCountUpdated", (data) => {
          if (onUnreadCountUpdatedRef.current) {
            onUnreadCountUpdatedRef.current(data);
          }
        });

        newConnection.on("MessagesSeen", (data) => {
          if (onMessagesSeenRef.current) {
            onMessagesSeenRef.current(data);
          }
        });
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [user, i18n.language]);

  const sendMessageSignalR = useCallback(async (receiverUserId, content, imageUrl = null) => {
    if (connection) {
      try {
        await connection.invoke("SendMessage", { receiverUserId, content, imageUrl });
      } catch (err) {
        console.error("SignalR Send Error: ", err);
        throw err;
      }
    } else {
      console.error("SignalR: No connection established");
    }
  }, [connection]);

  const markAsSeenSignalR = useCallback(async (otherUserId) => {
    if (connection) {
      try {
        await connection.invoke("MarkAsSeen", otherUserId);
      } catch (err) {
        console.error("SignalR MarkAsSeen Error: ", err);
        throw err;
      }
    } else {
      console.error("SignalR: No connection established");
    }
  }, [connection]);

  const setOnMessageReceived = (callback) => {
    onMessageReceivedRef.current = callback;
  };

  const setOnUnreadCountUpdated = (callback) => {
    onUnreadCountUpdatedRef.current = callback;
  };

  const setOnMessagesSeen = (callback) => {
    onMessagesSeenRef.current = callback;
  };

  return { 
    connection, 
    sendMessageSignalR, 
    markAsSeenSignalR, 
    setOnMessageReceived,
    setOnUnreadCountUpdated,
    setOnMessagesSeen
  };
};
