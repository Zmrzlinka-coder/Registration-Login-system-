const router=require('express').Router()
const pool=require('../db/db')
const authorize=require('../middleware/authorize')

router.get('/',authorize,async(req,res)=>{
    try {
        const user=await pool.query('SELECT * FROM users WHERE user_id=$1',[req.user])
        res.json(user.rows[0])
    } catch (error) {
        console.error(error.message)
        res.status(500).json('Server error...')
    }
})


module.exports=router