let io;

const initIo = (socketServer) => {
  io = require("socket.io")(socketServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("io not initialized");
  }
  console.log("io.emit");
  return io;
};

module.exports = {
  initIo,
  getIo,
};
