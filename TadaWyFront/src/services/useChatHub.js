import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { TokenService } from "./tokenService";
import { ENV } from "../config/env";

const HUB_URL = ENV.API_URL.replace("/api", "") + "/chatHub";

export const useChatHub = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const onMessageReceivedRef = useRef(null);

  useEffect(() => {
    const token = TokenService.getToken() || localStorage.getItem("userToken");
    
    if (!token) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
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
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  const sendMessageSignalR = useCallback(async (receiverUserId, content, imageUrl = null) => {
    if (connection) {
      try {
        await connection.invoke("SendMessage", receiverUserId, content, imageUrl);
      } catch (err) {
        console.error("SignalR Send Error: ", err);
        throw err;
      }
    } else {
      console.error("SignalR: No connection established");
    }
  }, [connection]);

  const setOnMessageReceived = (callback) => {
    onMessageReceivedRef.current = callback;
  };

  return { connection, sendMessageSignalR, setOnMessageReceived };
};
