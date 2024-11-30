const express = require("express");
const rootRouter = require('./routes/index.js')
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./db/connectDB.js");

const app = express()

dotenv.config();
connectDB()
app.use(cors())
app.use(express.json())

app.use('/api/v1', rootRouter)

app.listen(process.env.PORT, ()=>{
    console.log(`running on port ${process.env.PORT}`)
})