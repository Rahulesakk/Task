const axios= require('axios')
const Stock = require("../modules/account")
const { Server } = require('socket.io')
let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

const fetchDataAndStore = async () => {
    const symbols = ['BTC', 'ETH', 'LTC', 'XRP', 'ADA'];
    const apiKey = process.env.API_KEY; // Use your API key here
    try {
        for (const symbol of symbols) {
            const response = await axios.post(`https://api.livecoinwatch.com/coins/single`,
                {
                    currency: 'USD',
                    code: symbol,
                    meta: true
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                    }
                }
            );
           
            const data = response.data;
            console.log(data,"aaaaaaaaaaaaaaaaaaa")
            const newStockData = new Stock({
                symbol,
                markets: data.markets,
                allTimeHighUSD:data.allTimeHighUSD,
                image:data.png32,
                links:data.links,
                totalSupply:data.totalSupply,
                rate:data.rate,
                volume:data.volume,
                cap:data.cap,
                liquidity:data.liquidity,
                delta:data.delta,
                timestamp: new Date(),
            });
            await newStockData.save();
        }
        io.emit('newData');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

module.exports = {
    fetchDataAndStore,
    initializeSocket,
};
