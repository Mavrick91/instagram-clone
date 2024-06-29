// hooks/useWebSocket.ts
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import { NotificationWithRelations } from "@/actions/notification";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { PrismaNotification } from "@/types/notification";
import { ThreadMessage } from "@/types/thread";

import { socketManager } from "../../socket";

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [notifications, setNotifications] = useState<PrismaNotification[]>([]);
  const queryClient = useQueryClient();
  const user = useUserInfo();

  useEffect(() => {
    if (!user.id) return;

    let socket: Socket | null = socketManager.getSocket();
    if (!socket) {
      socket = socketManager.connect(user.id);
    }

    function onConnect() {
      console.log("Socket connected with ID:", user.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatMessage(message: ThreadMessage) {
      setMessages((prevMessages) => [...prevMessages, message]);
      queryClient.setQueryData(
        ["thread", user.username, message.threadId, "lastMessage"],
        message,
      );
    }

    function onNotification(notification: PrismaNotification) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onChatMessage);
    socket.on("notification", onNotification);

    setIsConnected(socket.connected);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("chat message", onChatMessage);
      socket?.off("notification", onNotification);
    };
  }, [user.id, user.username, queryClient]);

  const sendMessage = useCallback(
    (recipientId: number, senderId: number, message: ThreadMessage) => {
      const socket = socketManager.getSocket();
      if (socket?.connected) {
        socket.emit("chat message", { recipientId, senderId, message });
      } else {
        console.error("Socket is not connected. Unable to send message.");
      }
    },
    [],
  );

  const sendNotification = useCallback(
    (recipientId: string | number, notification: NotificationWithRelations) => {
      const socket = socketManager.getSocket();
      if (socket?.connected) {
        socket.emit("notification", { recipientId, notification });
      } else {
        console.error("Socket is not connected. Unable to send notification.");
      }
    },
    [],
  );

  const resetNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    messages,
    sendMessage,
    notifications,
    sendNotification,
    resetNotifications,
  };
}
