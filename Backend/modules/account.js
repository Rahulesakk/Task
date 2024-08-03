const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema(
    {
        symbol: String,
        markets: Number,
        allTimeHighUSD:Number,
        image:String,
        links:Object,
        totalSupply:Number,
        rate:Number,
        volume:Number,
        cap:Number,
        liquidity:Number,
        delta:Object,
        timestamp: Date,
        
    }
);

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock