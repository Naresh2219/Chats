import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

let socket;

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  
  const ENDPOINT = 'http://localhost:5000'; // Backend URL

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username');
    const room = queryParams.get('room');

    socket = io(ENDPOINT);

    socket.emit('joinRoom', { username, room });

    return () => {
      socket.disconnect();
    };
  }, [location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
