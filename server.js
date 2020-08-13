const express = require('express');
const connectDB = require('./config/db')
const app = express();

//connect database
connectDB();

//init Midleware - should allow us to get data in body
app.use(express.json({ extended: false }))

//get request to confirm server is running
app.get('/', (req, res) => res.send("API Running"))

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


//which port server will run in
const PORT = process.env.PORT || 5000;
//
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));