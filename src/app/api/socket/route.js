import { NextResponse } from "next/server";
import { Server } from "socket.io";

export async function GET() {
  if (!global.io) {
    const io = new Server({
      path: "api/socket",
      addTrailingSlash: false,
    });
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("message", (data) => {
        socket.broadcast.emit("message", data);
      });
    });
    global.io = io;
  }
  return NextResponse.json({ success: true });
}
