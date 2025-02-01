
require("dotenv").config();

const mongoose = require('mongoose');

const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"https://devpad2-0.onrender.com",
    methods:["GET","POST"],
  }
}

)

app.use(express.static(path.join(__dirname,"/dist")));

const port = 5000;

const Code = require('./Code');

const dbUrl= process.env.MONGODB_URL;

mongoose.connect(dbUrl);


// const io = require("socket.io")(3001, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// })

const defaultValue = {'html':'','css':'' , 'js':''};

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("get-code", async (id)=>{

    const code = await findOrCreateDocument(id);
    console.log('connected');
    
    socket.join(id);
    socket.emit("load-code" , code.data);
    socket.on("send-changes", info => {
      socket.broadcast.to(id).emit("receive-changes", info)
    })

    socket.on("save-code",async info=>{
      await Code.findByIdAndUpdate(id , {data: info});
    })

  }) 

})

server.listen(port, ()=>{
  console.log(`app is listening on ${port}`);
})

app.get('*',(req,res)=>{
  return res.sendFile(path.join(__dirname , '/dist','index.html'));
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Code.findById(id)
  if (document) return document
  return await Code.create({ _id: id, data: defaultValue })
}

