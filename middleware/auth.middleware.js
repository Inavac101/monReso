const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

module.exports.checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        try {
            const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await UserModel.findById(decodedToken.id).exec();
            res.locals.user = user;
            console.log(res.locals.user);
            next();
        } catch (error) {
            res.locals.user = null;
            res.cookie ('jwt', '', { maxAge : 1});
            next(error);
        }
    } else {
        res.locals.user = null;
        next();
    }
}
