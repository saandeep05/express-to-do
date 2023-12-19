const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return token;
}

module.exports = generateToken;