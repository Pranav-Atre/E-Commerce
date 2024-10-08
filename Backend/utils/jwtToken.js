const sendToken = (user,res) =>{
    const token = user.getJWTTOken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60*1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Set true for production
        sameSite: 'None',
    }
    res.cookie("token",token,options).json({ success: true, user, token});
}

module.exports = sendToken;