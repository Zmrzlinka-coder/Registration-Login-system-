const express= require('express')
const cors= require('cors')

const bodyParser =require('body-parser')

const app=express()

// middleware
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));


// Routes

// register and login routes
app.use("/auth",require('./routes/jwtAuth'))

// dashboard route
app.use('/dashboard',require('./routes/dashboard'))

app.listen(5000, ()=> console.log('server is listen on port 5000...'))