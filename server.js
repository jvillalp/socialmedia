const express = require('express');
const connectDB = require('./config/db')
const app = express();

//connect database
connectDB();
//get request to confirm server is running
app.get('/', (req, res) => res.send("API Running"))
//which port server will run in
const PORT = process.env.PORT || 5000;
//
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));