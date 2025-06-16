require('dotenv').config();
const express = require('express');
const connectToDb = require('./database/db.js');
const authRoutes = require('./routes/auth-routes.js');
const homeRoutes = require('./routes/home-routes.js');
const adminRoutes = require('./routes/admin-route.js');
const uploadImageRoutes = require('./routes/image-routes.js');
connectToDb();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/home',homeRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/image',uploadImageRoutes);

app.listen(PORT,()=>{
    console.log(`Server is now listening to port ${PORT}`)
})

