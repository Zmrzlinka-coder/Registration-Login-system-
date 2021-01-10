const router=require('express').Router()
const pool= require('../db/db.js')
const bcrypt=require('bcrypt')
const jwtGenerator=require('../utils/jwtGenerator')
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");


router.post('/register',validInfo,async(req,res)=>{
    try {
        // 1. distructure req.body
const {name , email , password}= req.body;
        // 2.check if user exists
const user=await pool.query('SELECT * FROM users WHERE user_email=$1',[email])
if(user.rows.length>0){
return res.status(401).json('user already exists')
}
        // 3.bcrypt the user_passwordconst salt = await bcrypt.genSalt(10);
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);
        // 4. enter new user inside database
        const newUser= await pool.query('INSERT INTO users (user_name,user_email,user_password) VALUES($1,$2,$3) RETURNING *',[name,email,bcryptPassword])

        // 5. generating a jwt token
        const token=jwtGenerator(newUser.rows[0].user_id)
        res.json({token})
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
})

router.post('/login',validInfo,async(req,res)=>{
    // 1.distrucrure req.body
const {email,password}=req.body
    // 2.check if user doesnt exist
const user=await pool.query('SELECT * FROM users WHERE user_email=$1',[email])
if(user.rows[0].length===0){
    return res.status(401).json('Password or email is incorrect')
}
    // 3.check if incoming password is the same db password
const validPassword=await bcrypt.compare(password,user.rows[0].user_password)
if(!validPassword){
    return res.status(401).json('Password or email is incorrect')
}
    // 4.give them a jwt token
const token=jwtGenerator(user.rows[0].user_id)
res.json(token)
})

router.get('/is-verify',authorize,async(req,res)=>{
    try {
        res.json(true)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
})

module.exports=router