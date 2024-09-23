import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Change to useNavigate

const Join = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate(); // Change to useNavigate

  const joinRoom = () => {
    if (username && room) {
      navigate(`/chat?username=${username}&room=${room}`); // Use navigate instead of history.push
    }
  };

  return (
    <div className="join">
      <h1>Join Chat Room</h1>
      <input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Enter room" value={room} onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
};

export default Join;
