import { io } from "socket.io-client";

const socketURL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

const Socket = io(socketURL, {
  transports: ["websocket"],
  reconnection: true,
  autoConnect: false, 
});

export default Socket;
