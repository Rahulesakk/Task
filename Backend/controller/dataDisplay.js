const Stock = require('../modules/account')

const datafetch = async (req,res) => {
    const { symbol } = req.query;
    console.log(req.query)
    try{
        let data = await Stock.find({symbol}).sort({ timestamp: -1 }).limit(20);
        return res.status(200).json({
            success:"True",
            message:"Data Fetched Successfully",
            data
        })
    }catch(err){
        return res.status(500).json({
            success:"False",
            message:"Internal Server Error",
            err
        })
    }
}

module.exports = {
    datafetch,
}