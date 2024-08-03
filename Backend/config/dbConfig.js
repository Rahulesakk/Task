const mongoose = require('mongoose');
const DB = process.env.DATABASE;
console.log(DB)

exports.dbConnect = () =>{
    mongoose.connect(DB,{
        // useNewUrlParser: true,
        //   useUnifiedTopology: true,
    })
    .then(()=>console.log('DB Connection Successfull'))
    .catch((e)=>{
        console.log(`Something went wrong with the DataBase. And the error is = ${e}`)
    })
}
