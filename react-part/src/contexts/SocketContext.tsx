import { createContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
  customParam: string;
}

export const SocketContext = createContext<Socket>({} as Socket);

export const SocketProvider = ({ children, customParam }: SocketProviderProps) => {
    const socket = io("http://localhost:3000", {
      query: {
        message: customParam,
      }
    });

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
  };