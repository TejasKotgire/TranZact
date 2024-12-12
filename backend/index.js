const express = require("express");
const rootRouter = require('./routes/index.js')
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./db/connectDB.js");

const app = express()

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
  
app.use(cors(corsOptions));

dotenv.config();
connectDB()
app.use(express.json())

app.use('/api/v1', rootRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`running on port ${process.env.PORT}`)
})