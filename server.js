const express = require('express');
const connectDb = require('./config/db');
const fileUpload = require('express-fileupload');
const apiRoutes = require("./routes/apiRoutes");
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const port = process.env.PORT

app.use(express.json())
app.use(fileUpload());
app.use(cookieParser())

// mongodb connection
connectDb();

app.get('/', (req, res) => {
    res.json({ message: "Api connection has been established" })
})

app.use('/api', apiRoutes);


// custom error handler
app.use((error, req, res, next) => {

    res.status(500).json({
        message: error.message,
        stack: error.stack
    })

})

app.listen(port, () => {
    console.log(`Your app listening on port ${port}`)
})