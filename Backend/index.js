const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const {dbConnect} = require("./config/dbConfig")
const {fetchDataAndStore,initializeSocket} = require("./controller/dataCalling")


dbConnect()
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World")
})
initializeSocket(server);

const StockRoutes = require("./routes/index")

app.use("/api/v1",StockRoutes)

// setInterval(fetchDataAndStore, 5000);

const port = process.env.PORT
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});