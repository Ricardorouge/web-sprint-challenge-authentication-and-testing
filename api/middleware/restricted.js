const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../secrets/index')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization
  if(!token){
    res.status(401).json({message:'token required'})
    return
  }
  try{
    req.decodedJWT = await jwt.verify(token,JWT_SECRET)
    next()
    return
  }catch(err){res.status(401).json({message:'token invalid'})}

  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
