import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://chatroombackend-thqu.onrender.com/");

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);


  const joinRoom = () => {
    socket.emit('join', { username, room });
  };

  
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { username, room, message });
      setMessage('');
    }
  };


  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <div>
      <h1>Chat Room</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>

      <div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
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