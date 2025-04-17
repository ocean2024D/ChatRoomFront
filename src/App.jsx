import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the backend Socket.IO server
const socket = io("https://chatroombackend-thqu.onrender.com/");

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Function to join the room
  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      socket.emit('join', { username, room });
    }
  };

  // Function to send a message to the room
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { username, room, message });
      setMessage('');  // Clear input field after sending message
    }
  };

  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup the socket listener on unmount
    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <div>
      <h1>Chat Room</h1>
      
      {/* Input for username */}
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      
      {/* Input for room name */}
      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      
      {/* Button to join room */}
      <button onClick={joinRoom}>Join Room</button>

      <div>
        {/* Input for typing messages */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        {/* Displaying messages */}
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
