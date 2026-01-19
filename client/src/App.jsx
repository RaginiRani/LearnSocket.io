import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {

  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (socket) {
      socket.emit("message", {message, room});
      setMessage("");
    }

    setMessage("");
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketId(newSocket.id);
      console.log("User connected", newSocket.id);
    });
    newSocket.on("receive-message", (data) => {
      console.log( data);
      setMessages((messages) => [...messages, data]);
    })
    newSocket.on("welcome", (s) => {
      console.log(s);
    });
 
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{height: 300}}/>
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
