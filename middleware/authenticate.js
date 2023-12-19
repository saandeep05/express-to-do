const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers)
    try {
        const token = authHeader.split(' ')[1];
        console.log("request from: " + token.slice(0, 4));
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(401).json({data: 'invalid token'});
            req.user = user;
        })
    } catch(e) {console.log(e);return res.status(404).json({data: "cannot find token"})}
    next();
}

module.exports = authenticate;