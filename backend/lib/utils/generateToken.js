import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId,res)=>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
   

    res.cookie('jwt', token, {
        maxAge: 15*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict", //prevemt CSRF attac
        secure: process.env.NODE_ENV !== 'development',  //only set cookies over https in production
    });
    return token;
}