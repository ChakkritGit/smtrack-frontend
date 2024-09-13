import { io } from "socket.io-client"
export const socket = io(String(import.meta.env.VITE_APP_SOCKET))