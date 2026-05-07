import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { useTranslation } from 'react-i18next';
import { TokenService } from '../../services/tokenService';
import { getConversations, getChatHistory, uploadChatImage } from '../../services/chatService';
import { useChatHub } from '../../services/useChatHub';

// Helper: decode JWT payload without any external library
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

const NAME_ID_KEY = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

function getCurrentUserId() {
  const token = TokenService.getToken() || localStorage.getItem("userToken") || "";
  const claims = decodeToken(token);
  return claims[NAME_ID_KEY] || claims["nameidentifier"] || claims["sub"] || null;
}

const Messages = () => {
  const { t, i18n } = useTranslation();
  const currentUserId = getCurrentUserId();
  const { 
    sendMessageSignalR, 
    setOnMessageReceived, 
    markAsSeenSignalR,
    setOnMessagesSeen,
    setOnUnreadCountUpdated
  } = useChatHub();

  const [chats, setChats] = useState([]);
  const [activeChatUserId, setActiveChatUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Use a ref to keep track of the current activeChatUserId for the SignalR callback
  const activeChatUserIdRef = useRef(activeChatUserId);
  useEffect(() => {
    activeChatUserIdRef.current = activeChatUserId;
  }, [activeChatUserId]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingChats(true);
        const data = await getConversations();
        setChats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchConversations();
  }, [i18n.language]);

  // Listen for UnreadCountUpdated
  useEffect(() => {
    if (setOnUnreadCountUpdated) {
      setOnUnreadCountUpdated((payload) => {
        const fromUser = payload.fromUserId || payload.FromUserId;
        const count = payload.unreadCount !== undefined ? payload.unreadCount : payload.UnreadCount;
        
        // If we are currently chatting with this user, ignore the increment/update from server
        const finalCount = fromUser === activeChatUserIdRef.current ? 0 : count;

        setChats((prev) =>
          prev.map((c) =>
            c.userId === fromUser ? { ...c, unreadCount: finalCount } : c
          )
        );
      });
    }
  }, [setOnUnreadCountUpdated]);

  // Listen for MessagesSeen
  useEffect(() => {
    if (setOnMessagesSeen) {
      setOnMessagesSeen((payload) => {
        const seenBy = payload.seenByUserId || payload.SeenByUserId;
        
        if (seenBy === activeChatUserIdRef.current) {
          setMessages((prev) =>
            prev.map((m) =>
              (m.receiverUserId === seenBy) ? { ...m, isSeen: true } : m
            )
          );
        }

        setChats((prevChats) =>
          prevChats.map((c) =>
            c.userId === seenBy ? { ...c, isSeen: true } : c
          )
        );
      });
    }
  }, [setOnMessagesSeen]);

  // Handle incoming messages from SignalR
  useEffect(() => {
    setOnMessageReceived((message) => {
      // If the message is from or to the active chat, update the messages list
      if (message.senderUserId === activeChatUserIdRef.current || message.receiverUserId === activeChatUserIdRef.current) {
        setMessages((prev) => [...prev, message]);
        // If we are in the chat, mark as seen
        if (message.senderUserId === activeChatUserIdRef.current) {
            markAsSeenSignalR(message.senderUserId).catch(() => {});
        }
      }

      // Update the chats sidebar
      setChats((prevChats) => {
        const otherUserId = message.senderUserId === currentUserId ? message.receiverUserId : message.senderUserId;
        const existingChatIndex = prevChats.findIndex((c) => c.userId === otherUserId);

        if (existingChatIndex > -1) {
          const updatedChats = [...prevChats];
          const existingChat = updatedChats[existingChatIndex];
          
          updatedChats[existingChatIndex] = {
            ...existingChat,
            lastMessage: message.content,
            lastMessageDate: message.createdAt,
            unreadCount: (message.senderUserId !== currentUserId && otherUserId !== activeChatUserIdRef.current) 
              ? (existingChat.unreadCount || 0) + 1 
              : 0,
            isSeen: message.senderUserId === currentUserId || otherUserId === activeChatUserIdRef.current
          };

          // Move the chat to the top
          const chat = updatedChats.splice(existingChatIndex, 1)[0];
          updatedChats.unshift(chat);
          return updatedChats;
        } else {
            // New conversation? We might need to fetch the list again or handle it gracefully
            return prevChats;
        }
      });
    });
  }, [setOnMessageReceived, currentUserId]);

  const activeChat = chats.find(c => c.userId === activeChatUserId) || null;

  const handleSelectChat = async (userId) => {
    setActiveChatUserId(userId);
    setMessages([]);
    
    // Clear unread count locally immediately
    setChats(prev => prev.map(c => c.userId === userId ? { ...c, unreadCount: 0, isSeen: true } : c));

    try {
      setLoadingMessages(true);
      const [history] = await Promise.all([
        getChatHistory(userId),
        markAsSeenSignalR(userId).catch(() => {})
      ]);
      setMessages(Array.isArray(history) ? history : []);
    } catch (err) {
      console.error("Failed to load chat history", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (text, file = null) => {
    if (!activeChatUserId) return;

    setSending(true);
    try {
      let imageUrl = null;
      if (file) {
        const uploadResult = await uploadChatImage(file);
        imageUrl = uploadResult?.imageUrl || null;
      }

      // Send via SignalR
      await sendMessageSignalR(activeChatUserId, text, imageUrl);
      
      // Note: We don't append to messages here because SignalR ReceiveMessage will trigger for our own messages too (depending on backend implementation)
      // or we can optimistically append if the backend doesn't echo back to the sender.
      // Based on typical SignalR ChatHubs, SendMessage usually sends to both.
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full bg-white dark:bg-[#0F172A] overflow-hidden border border-gray-100 dark:border-[#1E293B] shadow-sm">
      <ChatSidebar 
        chats={chats} 
        activeChatId={activeChatUserId} 
        onSelectChat={handleSelectChat} 
        loading={loadingChats}
      />
      <ChatArea 
        activeChat={activeChat} 
        messages={messages} 
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage} 
        loadingMessages={loadingMessages}
        sending={sending}
      />
    </div>
  );
};

export default Messages;
