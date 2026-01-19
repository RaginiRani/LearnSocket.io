import express from "express"
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors";


const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }
});

app.get("/", (req, res)=> {
    res.send("Hello World");
});

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    
    socket.on("message", ({message, room}) => {
        console.log(room);
        console.log(message);
        //io.emit("receive-message", data);
        //socket.broadcast.emit("receive-message", data);
        socket.to(room).emit("receive-message", message);
    });
    
    //socket.emit("welcome", `Welcome to the server,${socket.id}`);
    //socket.broadcast.emit("welcome",`${socket.id} joined the server.`);
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});