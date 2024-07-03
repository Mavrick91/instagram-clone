"use client";

import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(userId: number): Socket {
    if (!this.socket) {
      this.socket = io(URL, {
        path: "/api/socketio",
        auth: { userId },
        autoConnect: false,
      });
      this.socket.connect();
    }
    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketManager = SocketManager.getInstance();
