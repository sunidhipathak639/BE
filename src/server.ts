import app from './app';
import http from 'http'; // Importing the native http module to create a server
import socketIo from 'socket.io'; // Importing Socket.io

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = new socketIo.Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // You can also emit events from here based on actions
  // socket.emit('message', 'Hello from server!');

  // More custom events can be handled here
  // socket.on('event_name', (data) => {
  //   console.log(data);
  // });
});
app.set('io', io);

// Start the server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
