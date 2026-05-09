import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getNotifications, markAsReadPatch, markAllAsReadPatch } from "../services/notificationService";
import { useNotificationHub } from "../services/useNotificationHub";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { t } = useTranslation();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
    }
    try {
      const response = await getNotifications();
      // Ensure response is an array
      const data = Array.isArray(response) ? response : (response?.data || []);
      const unreadData = data.filter(n => !n.isRead);
      setNotifications(unreadData);
      setUnreadCount(unreadData.length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [user, t]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleIncomingNotification = useCallback((notification) => {
    // If it's a chat message (Type 6) and user is on messages page, ignore it
    // because ReceiveMessage from ChatHub will handle it.
    if (notification.type === 6 && window.location.pathname.includes('/messages')) {
      return;
    }
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  // Connect to SignalR hub
  useNotificationHub(handleIncomingNotification);

  const markNotificationAsRead = async (id) => {
    try {
      await markAsReadPatch(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
        await markAllAsReadPatch();
        setNotifications([]);
        setUnreadCount(0);
    } catch (err) {
        console.error("Failed to mark all as read", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      fetchNotifications, 
      markNotificationAsRead, 
      markAllAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
