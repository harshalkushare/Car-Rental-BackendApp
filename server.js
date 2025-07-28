const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const geminiRoute = require("./routes/geminiRoute");

dotenv.config();
connectDB();

const app = express();

//CORS Conifiguration
// app.use(cors({
//     origin:['*'],
//     methods:['GET','POST','PUT','DELETE','PATCH'],
//     credentials:true
// }));

app.use(cors({
  origin: "http://localhost:5173",  
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true              
}));

app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

//Routes
app.use('/api/users',userRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/car',carRoutes);
app.use('/api/booking',bookingRoutes);
app.use("/api/support", geminiRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));