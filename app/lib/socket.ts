// frontend/lib/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
});

export default socket;