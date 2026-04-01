import { io } from "socket.io-client";
import { baseURL } from "./api/config";

const SOCKET_URL = baseURL.replace(/v1\//g, "");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});
