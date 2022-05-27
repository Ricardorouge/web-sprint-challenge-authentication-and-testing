const jwt = require('jsonwebtoken')
const Users = require('../users/usersModel')
const {JWT_SECRET} = require('../secrets/index')

const checkUserUnique = async (req,res,next)=>{
    try{
        const [user] = await Users.getBy({username:req.body.username})
        if(user){
            res.status(401).json({message:'username taken'})
            return
        }else{ next() }
    }catch(err){next(err)}
}
const validateBody = (req,res,next)=>{
    const {username,password} = req.body
    if(!username || !password){
        res.status(400).json({message:'username and password required'})
        return
    } else{ next()}
}


module.exports = {
    checkUserUnique,
    validateBody
}