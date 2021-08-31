import io from "socket.io-client";

socket = io("https://vitcoin.herokuapp.com/", {
  transports: ["websocket"],
  upgrade: false,
});

export default socket;
