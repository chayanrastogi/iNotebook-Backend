const jwt = require('jsonwebtoken');

const JWT_SECRET = "YouAreVerified"

const fetchUser = (req, res, next) => {
    //Get the user from the jwt token and add id to req obj
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using valid credentials" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using valid credentials" });
    }
}

module.exports = fetchUser