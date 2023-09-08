import { createContext } from "react";
import { io, Socket } from "socket.io-client";


export const socket = io("http://localhost:3007")
export const SocketContext = createContext<Socket>(socket);
export const SocketProvider = SocketContext.Provider;
