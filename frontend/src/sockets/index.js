import { io } from "socket.io-client";
import { socketEvents } from "./events";

export const socket = io("http://localhost:5001");

export const initSockets = () => {
  socketEvents();
};
