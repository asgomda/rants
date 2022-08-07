const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

        console.log(`MongoDB Connected Successfully: ${conn.connection.host} `)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB;