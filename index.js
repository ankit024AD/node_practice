const express = require("express")
const morgan=require('morgan')
const app = express();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config()

connectDb();
app.use(express.json())
app.use(morgan('dev'))
const port = process.env.PORT || 8081
app.use(express.json());
app.listen(port, ()=>console.log(`server is ready:${port}`));
app.use("/api/users", require("./routes/usersRoutes"))
app.use(errorHandler)
app.get("/",(req,res,next)=>{
    res.setHeader("location","https://www.google.com")
    res.status(302).send();
})
