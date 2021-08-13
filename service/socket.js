import io from 'socket.io-client';

socket = io("https://vitcoin.herokuapp.com/", {
    transports: ['websocket'],
    upgrade: false
});

// socket = io("https://vitcoin.herokuapp.com/");

export default socket;