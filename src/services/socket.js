import { io } from "socket.io-client";
import { baseURL, rootURL } from "../api/config";
import { STORAGE_KEY } from "../utils/constant";
const generateFullUrl = (_) => {
  var companyStorage = localStorage.getItem(STORAGE_KEY.COMPANY);
  var _baseUrl = baseURL;
  if (companyStorage) {
    var companyJson = JSON.parse(companyStorage);
    _baseUrl = companyJson?.baseUrl ?? baseURL;
    _baseUrl += "/medicmms_gw/" + companyJson?.port + "/v1/";
    // _baseUrl = rootURL;
  }

  if (_) {
    _baseUrl += _;
  }
  return _baseUrl;
};

export const socket = io(generateFullUrl(), {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 1,
});

// Global connection status logging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("🔴 Socket connection error:", error);
});

socket.onAny((event, ...args) => {
  console.log("📩 socket event:", event, args);
});
